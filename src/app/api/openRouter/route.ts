import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr } from "@/lib";
import { PREMIUM_MODELS } from "@/hooks/useLLM";
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
  const Authorization = headerApiKey || API_KEY || "";

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
  });
}
