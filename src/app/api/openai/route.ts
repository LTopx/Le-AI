import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isUndefined } from "@/lib";
import { prisma } from "@/lib/prisma";

// export const runtime = "edge";

const getEnvProxyUrl = () => {
  const API_PROXY = process.env.NEXT_PUBLIC_OPENAI_API_PROXY;
  if (!API_PROXY) return "";
  if (API_PROXY[API_PROXY.length - 1] === "/")
    return API_PROXY.slice(0, API_PROXY.length - 1);
  return API_PROXY;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  const headerApiKey = headersList.get("Authorization");
  const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session && !headerApiKey) {
    return NextResponse.json({ error: 10001 }, { status: 500 });
  }

  // first use local
  // then use env configuration
  // or empty
  const Authorization = headerApiKey || NEXT_PUBLIC_OPENAI_API_KEY || "";

  if (!Authorization) {
    return NextResponse.json({ error: 10002 }, { status: 500 });
  }

  const {
    model,
    proxy: proxyUrl,
    temperature,
    max_tokens,
    prompt,
    chat_list,
  } = await request.json();

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

    if (session) {
      await prisma.user.update({
        data: { recentlyUse: new Date() },
        where: { id: session?.user.id },
      });
    }

    if (response.status !== 200) {
      return new Response(response.body, { status: 500 });
    }

    return new Response(response.body);
  } catch (error) {
    console.log(error, "openai error");
    return new Response("Error", { status: 500 });
  }
}
