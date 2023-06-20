import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isUndefined, calcTokens, LResponseError } from "@/lib";
import type { supportModelType } from "@/lib/gpt-tokens";
import { prisma } from "@/lib/prisma";
import { PREMIUM_MODELS } from "@/hooks";

// export const runtime = "edge";

const getEnvProxyUrl = () => {
  const API_PROXY = process.env.NEXT_PUBLIC_OPENAI_API_PROXY;
  if (!API_PROXY) return "";
  if (API_PROXY[API_PROXY.length - 1] === "/")
    return API_PROXY.slice(0, API_PROXY.length - 1);
  return API_PROXY;
};

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

    const { usedTokens, usedUSD } = calcTokens(final, model, true);

    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (findUser) {
      const costTokens = findUser.costTokens + usedTokens;
      const costUSD = Number((findUser.costUSD + usedUSD).toFixed(5));
      await prisma.user.update({
        where: { id: userId },
        data: {
          costTokens,
          costUSD,
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
  const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const {
    model,
    modelLabel,
    proxy: proxyUrl,
    temperature,
    max_tokens,
    prompt,
    chat_list,
  } = await request.json();

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session && !headerApiKey) {
    return NextResponse.json({ error: 10001 }, { status: 500 });
  }

  // Logging in without your own key means using the author's key.
  // At this point, you need to check the token balance of the current account first.
  if (!headerApiKey) {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });
    if (!user) return LResponseError("User does not exist");

    // audit user license
    if (
      user.license_type !== "premium" &&
      user.license_type !== "team" &&
      PREMIUM_MODELS.includes(modelLabel)
    ) {
      // 无权使用模型。需使用API Key或开通Premium License以获得使用权限。
      return LResponseError(
        "Use API Key or Premium License to get permission for model usage."
      );
    }

    const { costTokens, availableTokens } = user;
    if (costTokens >= availableTokens) {
      return NextResponse.json({ error: 10005 }, { status: 500 });
    }
  }

  // first use local
  // then use env configuration
  // or empty
  const Authorization = headerApiKey || NEXT_PUBLIC_OPENAI_API_KEY || "";

  if (!Authorization) {
    return NextResponse.json({ error: 10002 }, { status: 500 });
  }

  const ENV_API_PROXY = getEnvProxyUrl();

  const proxy = proxyUrl || ENV_API_PROXY || "https://api.openai.com";

  const fetchURL = proxy + "/v1/chat/completions";

  const messages = [...chat_list];

  if (prompt) messages.unshift({ role: "system", content: prompt });

  try {
    const response = await fetch(fetchURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Authorization}`,
      },
      method: "POST",
      body: JSON.stringify({
        stream: true,
        model,
        temperature: isUndefined(temperature) ? 1 : temperature,
        max_tokens: isUndefined(max_tokens) ? 2000 : max_tokens,
        messages,
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
  } catch (error) {
    console.log(error, "openai error");
    return new Response("Error", { status: 500 });
  }
}
