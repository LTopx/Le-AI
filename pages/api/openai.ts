import { isUndefined } from "@/utils";
import { AI_MODELS } from "@/utils/models";

export const config = {
  runtime: "edge",
};

const getEnvProxyUrl = () => {
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

  if (!Authorization) {
    return new Response("Error", {
      status: 500,
      statusText: "Missing API Key",
    });
  }

  const {
    model,
    proxy: proxyUrl,
    temperature,
    max_tokens,
    prompt,
    chat_list,
  } = await req.json();

  const findModel = AI_MODELS.find((item) => {
    return item.models.find((val) => val.value === model);
  });

  if (!findModel) {
    return new Response("Error", {
      status: 500,
      statusText: "Language model parameters are incorrect",
    });
  }

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

    return new Response(response.body);
  } catch (error) {
    console.log(error, "openai error");
    return new Response("Error", { status: 500 });
  }
};

export default handler;
