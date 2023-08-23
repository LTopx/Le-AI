import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr } from "@/lib";
import { regular } from "./regular";

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
    prompt,
    chat_list,
  } = await request.json();

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session && !headerApiKey) return ResErr({ error: 10001 });

  let user;
  let leaiApiKey = "";
  let leai_used_quota = 0;
  let leai_userId = "";

  if (!headerApiKey) {
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

  const { availableTokens } = user;
  if (availableTokens <= 0) return ResErr({ error: 10005 });

  let Authorization = "";
  // If you use the leai API key, you will need an environment variable key.
  if (leaiApiKey) {
    Authorization = API_KEY || "";
  } else {
    Authorization = headerApiKey || API_KEY || "";
  }

  if (!Authorization) return ResErr({ error: 10002 });

  const fetchURL = "https://openrouter.ai/api/v1/chat/completions";

  const messages = [...chat_list];

  const userId = session?.user.id;

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
    leaiApiKey,
    leai_used_quota,
    leai_userId,
  });
}
