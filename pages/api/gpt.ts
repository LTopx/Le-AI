import { isUndefined } from "@/utils";

export const config = {
  runtime: "edge",
};

const getProxyUrl = () => {
  const API_PROXY = process.env.NEXT_PUBLIC_OPENAI_API_PROXY;
  if (!API_PROXY) return "";
  if (API_PROXY[API_PROXY.length - 1] === "/")
    return API_PROXY.slice(0, API_PROXY.length - 1);
  return API_PROXY;
};

const handler = async (req: Request) => {
  // first use local
  // then use env configuration
  // or empty
  const Authorization =
    req.headers.get("Authorization") ||
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    "";

  const { proxyUrl, temperature, chat_list } = await req.json();

  const API_PROXY = getProxyUrl();

  const proxy = proxyUrl || API_PROXY || "https://api.openai.com";

  const fetchURL = proxy + "/v1/chat/completions";

  const response = await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
    },
    method: "POST",
    body: JSON.stringify({
      stream: true,
      model: "gpt-3.5-turbo",
      temperature: isUndefined(temperature) ? temperature : 1,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
        },
        ...chat_list,
      ],
    }),
  });

  return new Response(response.body);
};

export default handler;
