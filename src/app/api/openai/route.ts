import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr } from "@/lib";
import { PREMIUM_MODELS } from "@/hooks/useLLM";
import { regular } from "./regular";
import { function_call } from "./function_call";

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
  const headerApiKey = headersList.get("Authorization") || "";
  const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const {
    // model 用于接口发送给 OpenAI 或者其他大语言模型的请求参数
    model,
    // modelLabel 用于 Token 计算
    modelLabel,
    proxy: proxyUrl,
    temperature,
    max_tokens,
    prompt,
    chat_list,
    plugins,
  } = await request.json();

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session && !headerApiKey) return ResErr({ error: 10001 });

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
  const Authorization = headerApiKey || NEXT_PUBLIC_OPENAI_API_KEY || "";

  if (!Authorization) return ResErr({ error: 10002 });

  const ENV_API_PROXY = getEnvProxyUrl();
  const proxy = proxyUrl || ENV_API_PROXY || "https://api.openai.com";
  const fetchURL = proxy + "/v1/chat/completions";

  const messages = [...chat_list];

  const userId = session?.user.id;

  // Without using plugins, we will proceed with a regular conversation.
  if (!plugins?.length) {
    return await regular({
      prompt,
      messages,
      fetchURL,
      Authorization,
      model,
      modelLabel,
      temperature,
      max_tokens,
      userId,
      headerApiKey,
    });
  }

  return await function_call({
    plugins,
    fetchURL,
    Authorization,
    model,
    modelLabel,
    temperature,
    max_tokens,
    messages,
    userId,
    headerApiKey,
  });
}
