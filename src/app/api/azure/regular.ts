import { ResErr, isUndefined } from "@/lib";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import { prisma } from "@/lib/prisma";
import { calcTokens } from "@/lib/calcTokens";
import { BASE_PRICE } from "@/utils/constant";

interface IRegular {
  messages: any[];
  fetchURL: string;
  Authorization: string;
  temperature?: number;
  max_tokens?: number;
  modelLabel: supportModelType;
  session: any;
  headerApiKey?: string | null;
  prompt?: string;
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// support printer mode and add newline
const stream = async (
  readable: ReadableStream,
  writable: WritableStream,
  messages: any[],
  model: supportModelType,
  userId?: string,
  headerApiKey?: string | null
) => {
  const reader = readable.getReader();
  const writer = writable.getWriter();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let buffer = "";
  let content = "";
  let resultContent = "";
  while (true) {
    let resultText = "";
    let { value, done } = await reader.read();
    if (done) break;

    content += decoder.decode(value);
    buffer += decoder.decode(value, { stream: true }); // stream: true is important here,fix the bug of incomplete line
    let lines = buffer.split(delimiter);
    let contentLines = content.split(newline).filter((item) => item?.trim());

    // Loop through all but the last line, which may be incomplete.
    for (let i = 0; i < lines.length - 1; i++) {
      await writer.write(encoder.encode(lines[i] + delimiter));
      await sleep(20);
    }

    for (const contentLine of contentLines) {
      const message = contentLine.replace(/^data: /, "");
      if (message !== "[DONE]") {
        try {
          const content = JSON.parse(message).choices[0].delta.content;
          if (content) resultText += content;
        } catch {}
      }
    }

    resultContent = resultText;
    buffer = lines[lines.length - 1];
  }

  // If use own key, no need to calculate tokens
  if (userId && !headerApiKey) {
    const final = [...messages, { role: "assistant", content: resultContent }];

    const { usedTokens, usedUSD } = calcTokens(final, model);

    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (findUser) {
      const costTokens = findUser.costTokens + usedTokens;
      const costUSD = Number((findUser.costUSD + usedUSD).toFixed(5));
      const availableTokens =
        findUser.availableTokens - Math.ceil(usedUSD * BASE_PRICE);

      await prisma.user.update({
        where: { id: userId },
        data: {
          costTokens,
          costUSD,
          availableTokens,
        },
      });
    }
  }

  if (buffer) {
    await writer.write(encoder.encode(buffer));
  }

  await writer.write(encodedNewline);
  await writer.close();
};

export const regular = async ({
  messages,
  fetchURL,
  Authorization,
  temperature,
  max_tokens,
  modelLabel,
  session,
  headerApiKey,
  prompt,
}: IRegular) => {
  if (prompt) messages.unshift({ role: "system", content: prompt });

  try {
    const response = await fetch(fetchURL, {
      headers: {
        "Content-Type": "application/json",
        "api-key": Authorization,
        "X-Accel-Buffering": "no",
      },
      method: "POST",
      body: JSON.stringify({
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        temperature: isUndefined(temperature) ? 1 : temperature,
        max_tokens: isUndefined(max_tokens) ? 2000 : max_tokens,
        messages,
        stop: null,
      }),
    });

    if (response.status !== 200) {
      return new Response(response.body, { status: 500 });
    }

    const { readable, writable } = new TransformStream();
    stream(
      response.body as ReadableStream,
      writable,
      messages,
      modelLabel,
      session?.user.id,
      headerApiKey
    );
    return new Response(readable, response);
  } catch (error: any) {
    console.log(error, "openai error");
    return ResErr({ msg: error?.message || "Error" });
  }
};
