import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, checkAuth } from "@/lib";
// import { PREMIUM_MODELS } from "@/hooks/useLLM";
import { regular } from "./regular";

export const maxDuration = 300;

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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  const headerApiKey = headersList.get("Authorization") || "";
  const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  const {
    // model 用于接口发送给 OpenRouter 的请求参数
    model,
    // modelLabel 用于 Token 计算
    modelLabel,
    temperature,
    max_tokens,
    messages,
  } = await request.json();

  // if (!session && !headerApiKey) return ResErr({ error: 10001 });
  if (!session && !headerApiKey && API_KEY && checkAuth()) {
    return ResErr({ error: 10001 });
  }

  let user;
  let leaiApiKey = "";
  let leai_used_quota = 0;
  let leai_userId = "";

  // 如果是已经登录且没有配置自己 key 的用户或者是用 Le-AI key 的用户，需要校验用户的权限
  // If it is a user who has already logged in and has not configured their own key,
  // or if it is a user using the Le-AI key, it is necessary to verify the user's permissions.
  if ((session && !headerApiKey) || headerApiKey.startsWith("leai-")) {
    if (session && !headerApiKey) {
      user = await prisma.user.findUnique({
        where: { id: session?.user.id },
      });
    } else if (headerApiKey.startsWith("leai-")) {
      leaiApiKey = headerApiKey;
      if (!API_KEY) return ResErr({ error: 20019 });

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
    Authorization = API_KEY || "";
  } else {
    Authorization = headerApiKey || API_KEY || "";
  }

  if (!Authorization) return ResErr({ error: 10002 });

  const fetchURL = "https://openrouter.ai/api/v1/chat/completions";

  const userId = session?.user.id;

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
