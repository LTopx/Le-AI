export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  const Authorization = req.headers.get("Authorization") || "";
  const { chat_list } = await req.json();
  const { OPENAI_API_PROXY } = process.env;

  const proxyURL = OPENAI_API_PROXY || "https://api.openai.com";
  const fetchURL = proxyURL + "/v1/chat/completions";

  const response = await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
    },
    method: "POST",
    body: JSON.stringify({
      stream: true,
      model: "gpt-3.5-turbo",
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
