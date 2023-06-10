import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isUndefined } from "@/lib";
import { prisma } from "@/lib/prisma";

// export const runtime = "edge";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// support printer mode and add newline
const stream = async (readable: ReadableStream, writable: WritableStream) => {
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
  while (true) {
    let { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true }); // stream: true is important here,fix the bug of incomplete line
    let lines = buffer.split(delimiter);

    // Loop through all but the last line, which may be incomplete.
    for (let i = 0; i < lines.length - 1; i++) {
      await writer.write(encoder.encode(lines[i] + delimiter));
      await sleep(20);
    }

    buffer = lines[lines.length - 1];
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

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session && !headerApiKey) {
    return NextResponse.json({ error: 10001 }, { status: 500 });
  }

  // first use local
  // then use env configuration
  // or empty
  const Authorization = headerApiKey || ENV_API_KEY || "";

  if (!Authorization) {
    return NextResponse.json({ error: 10002 }, { status: 500 });
  }

  if (!ENV_API_VERSION) {
    return NextResponse.json({ error: 10004 }, { status: 500 });
  }

  const { model, temperature, max_tokens, prompt, resourceName, chat_list } =
    await request.json();

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

    stream(response.body as ReadableStream, writable);

    if (session) {
      await prisma.user.update({
        data: { recentlyUse: new Date() },
        where: { id: session?.user.id },
      });
    }

    return new Response(readable, response);
  } catch (error: any) {
    console.log(error, "azure error");
    return new Response("Error", { status: 500 });
  }
}
