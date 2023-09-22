import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/plugin/auth";
import { ResErr, checkAuth, ResSuccess } from "@/lib";
import { calcTokens } from "@/lib/calcTokens";
import { BASE_PRICE } from "@/utils/constant";

const getEnvProxyUrl = () => {
  const API_PROXY = process.env.NEXT_PUBLIC_OPENAI_API_PROXY;
  if (!API_PROXY) return "";
  if (API_PROXY[API_PROXY.length - 1] === "/") {
    return API_PROXY.slice(0, API_PROXY.length - 1);
  }
  return API_PROXY;
};

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const headersList = headers();
  const headerApiKey = headersList.get("Authorization") || "";
  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const { proxy: proxyUrl, messages, summarize_content } = await request.json();

  if (!session && !headerApiKey && API_KEY && checkAuth()) {
    return ResErr({ error: 10001 });
  }

  // model 用于接口发送给 OpenAI 或者其他大语言模型的请求参数
  const model = "gpt-3.5-turbo";
  // modelLabel 用于 Token 计算
  const modelLabel = "gpt-3.5-turbo";
  const temperature = 1;
  const max_tokens = 2000;

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

  const ENV_API_PROXY = getEnvProxyUrl();
  let proxy = "";
  if (leaiApiKey) {
    proxy = ENV_API_PROXY || "https://api.openai.com/v1";
  } else {
    proxy = proxyUrl || ENV_API_PROXY || "https://api.openai.com/v1";
  }
  const fetchURL = proxy + "/chat/completions";

  const userId = session?.user.id;

  const params = {
    model,
    temperature,
    max_tokens,
    messages: [...messages, { role: "system", content: summarize_content }],
  };

  try {
    const res = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Authorization}`,
      },
      body: JSON.stringify(params),
    }).then((res) => res.json());

    let localUserId = userId;

    // Start calculating token consumption.
    const content = res.choices[0]?.message.content;
    const final = [...params.messages, { role: "assistant", content }];
    const { usedTokens, usedUSD } = calcTokens(final, modelLabel);
    const used_availableTokens = Math.ceil(usedUSD * BASE_PRICE);

    if (leaiApiKey) {
      await prisma.apiTokens.update({
        where: { key: leaiApiKey },
        data: {
          used_quota: leai_used_quota + used_availableTokens,
        },
      });

      if (!localUserId) localUserId = leai_userId;
    }

    // If use own key, no need to calculate tokens
    if (localUserId && (!headerApiKey || leaiApiKey)) {
      const findUser = await prisma.user.findUnique({
        where: { id: localUserId },
      });

      if (findUser) {
        const costTokens = findUser.costTokens + usedTokens;
        const costUSD = Number((findUser.costUSD + usedUSD).toFixed(5));
        const availableTokens = findUser.availableTokens - used_availableTokens;

        await prisma.user.update({
          where: { id: localUserId },
          data: {
            costTokens,
            costUSD,
            availableTokens,
          },
        });
      }
    }

    return ResSuccess({ data: content });
  } catch (error: any) {
    console.log(error, "summarize api error");
    return ResErr({ msg: error?.message || "Error" });
  }
}
