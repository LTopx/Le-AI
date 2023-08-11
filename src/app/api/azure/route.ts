import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr } from "@/lib";
import { PREMIUM_MODELS } from "@/hooks/useLLM";
import { regular } from "./regular";
import { function_call } from "./function_call";

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
    prompt,
    resourceName,
    chat_list,
    plugins,
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

  if (!RESOURCE_NAME) return ResErr({ error: 20010 });

  const fetchURL = `https://${RESOURCE_NAME}.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=${ENV_API_VERSION}`;

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
    modelLabel,
    temperature,
    max_tokens,
    messages,
    userId,
    headerApiKey,
  });
}
