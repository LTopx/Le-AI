import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { calcTokens } from "@/lib/calcTokens";
import { authOptions } from "@/utils/plugin/auth";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import { prisma } from "@/lib/prisma";
import { ResErr, isUndefined } from "@/lib";
import { PREMIUM_MODELS } from "@/hooks/useLLM";
import { BASE_PRICE } from "@/utils/constant";

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

  // const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  // let decodedValue = decoder.decode(value);
  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let buffer = "";
  let content = "";
  let resultContent = "";
  while (true) {
    let resultText = "";
    let { value, done } = await reader.read();
    if (done) {
      break;
    }

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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  const headerApiKey = headersList.get("Authorization");
  const ENV_API_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY;
  const ENV_API_VERSION = process.env.NEXT_AZURE_OPENAI_API_VERSION;

  const {
    model,
    modelLabel,
    temperature,
    max_tokens,
    prompt,
    resourceName,
    chat_list,
  } = await request.json();

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session && !headerApiKey) return ResErr({ error: 10001 });

  // Logging in without your own key means using the author's key.
  // At this point, you need to check the token balance of the current account first.
  if (!headerApiKey) {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });
    if (!user) return ResErr({ error: 20002 });

    // audit user license
    if (
      user.license_type !== "premium" &&
      user.license_type !== "team" &&
      PREMIUM_MODELS.includes(modelLabel)
    ) {
      return ResErr({ error: 20009 });
    }

    const { availableTokens } = user;
    if (availableTokens <= 0) return ResErr({ error: 10005 });
  }

  // first use local
  // then use env configuration
  // or empty
  const Authorization = headerApiKey || ENV_API_KEY || "";

  if (!Authorization) return ResErr({ error: 10002 });

  if (!ENV_API_VERSION) return ResErr({ error: 10004 });

  const RESOURCE_NAME =
    resourceName || process.env.NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME;

  const fetchURL = `https://${RESOURCE_NAME}.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=${ENV_API_VERSION}`;

  const messages = [...chat_list];
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
        max_tokens: isUndefined(max_tokens) ? 2000 : max_tokens,
        messages,
        presence_penalty: 0,
        stop: null,
        stream: true,
        temperature: isUndefined(temperature) ? 1 : temperature,
      }),
    });

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
}
