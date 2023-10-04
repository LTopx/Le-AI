import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, checkAuth } from "@/lib";
// import { PREMIUM_MODELS } from "@/hooks/useLLM";
import { regular } from "./regular";
import { function_call } from "./function_call";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

const PREMIUM_MODELS = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0613",
  "Claude v2",
  "PaLM 2 Bison",
  "Llama v2 13B",
  "Llama v2 70B",
];

export const maxDuration = 300;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  const headerApiKey = headersList.get("Authorization") || "";
  const ENV_API_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY;
  const ENV_API_VERSION =
    process.env.NEXT_AZURE_OPENAI_API_VERSION || "2023-07-01-preview";

  const {
    // model 用于接口发送给 OpenAI 或者其他大语言模型的请求参数
    model,
    // modelLabel 用于 Token 计算
    modelLabel,
    temperature,
    max_tokens,
    resourceName,
    messages,
    plugins,
  } = await request.json();

  if (!session && !headerApiKey && ENV_API_KEY && checkAuth()) {
    return ResErr({ error: 10001 });
  }

  let user;
  let leaiApiKey = "";
  let leai_used_quota = 0;
  let leai_userId = "";

  // Logging in without your own key means using the author's key.
  // At this point, you need to check the token balance of the current account first.

  if ((session && !headerApiKey) || headerApiKey.startsWith("leai-")) {
    if (session && !headerApiKey) {
      user = await prisma.user.findUnique({
        where: { id: session?.user.id },
      });
    } else if (headerApiKey.startsWith("leai-")) {
      leaiApiKey = headerApiKey;
      if (!ENV_API_KEY) return ResErr({ error: 20019 });

      const apiToken = await prisma.apiTokens.findUnique({
        where: { key: leaiApiKey },
      });
      if (!apiToken) return ResErr({ error: 20015 });
      const { userId, status, used_quota, total_quota, expire } = apiToken;
      leai_used_quota = used_quota;
      leai_userId = userId;
      if (!status) return ResErr({ error: 20016 });
      if (total_quota !== -1 && total_quota - used_quota <= 0) {
        return ResErr({ error: 20017 });
      }

      if (expire) {
        if (+new Date() > +new Date(expire)) return ResErr({ error: 20018 });
      }

      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

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

  let Authorization = "";
  // If you use the leai API key, you will need an environment variable key.
  if (leaiApiKey) {
    Authorization = ENV_API_KEY || "";
  } else {
    Authorization = headerApiKey || ENV_API_KEY || "";
  }

  if (!Authorization) return ResErr({ error: 10002 });

  if (!ENV_API_VERSION) return ResErr({ error: 10004 });

  let RESOURCE_NAME = "";
  if (leaiApiKey) {
    RESOURCE_NAME = process.env.NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME || "";
  } else {
    RESOURCE_NAME =
      resourceName || process.env.NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME || "";
  }

  if (!RESOURCE_NAME) return ResErr({ error: 20010 });

  const fetchURL = `https://${RESOURCE_NAME}.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=${ENV_API_VERSION}`;

  const userId = session?.user.id;

  // Without using plugins, we will proceed with a regular conversation.
  if (!plugins?.length) {
    return await regular({
      messages,
      fetchURL,
      Authorization,
      model,
      modelLabel,
      temperature,
      max_tokens,
      userId,
      headerApiKey,
      leaiApiKey,
      leai_used_quota,
      leai_userId,
    });
  }

  return await function_call({
    plugins,
    fetchURL,
    Authorization,
    modelLabel,
    temperature,
    max_tokens,
    messages,
    userId,
    headerApiKey,
    leaiApiKey,
    leai_used_quota,
    leai_userId,
  });
}
