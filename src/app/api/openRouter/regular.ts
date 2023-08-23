import { ResErr, isUndefined } from "@/lib";
import { stream } from "@/lib/stream";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import type { IFetchOpenRouter } from "./types";

interface IRegular extends IFetchOpenRouter {
  prompt?: string;
  modelLabel: supportModelType;
  userId?: string;
  headerApiKey?: string;
  leaiApiKey?: string;
  leai_used_quota?: number;
  leai_userId?: string;
}

const fetchOpenRouter = async ({
  fetchURL,
  Authorization,
  model,
  temperature,
  max_tokens,
  messages,
}: IFetchOpenRouter) => {
  return await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
      "HTTP-Referer": "https://chat.ltopx.com",
      "X-Title": "L-GPT",
    },
    method: "POST",
    body: JSON.stringify({
      stream: true,
      model,
      temperature: isUndefined(temperature) ? 1 : temperature,
      max_tokens: isUndefined(max_tokens) ? 1000 : max_tokens,
      messages,
    }),
  });
};

export const regular = async ({
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
}: IRegular) => {
  if (prompt) messages.unshift({ role: "system", content: prompt });

  try {
    const response = await fetchOpenRouter({
      fetchURL,
      Authorization,
      model,
      temperature,
      max_tokens,
      messages,
    });

    if (response.status !== 200) {
      return new Response(response.body, { status: 500 });
    }

    const { readable, writable } = new TransformStream();

    stream({
      readable: response.body as ReadableStream,
      writable,
      userId,
      headerApiKey,
      messages,
      model,
      modelLabel,
      leaiApiKey,
      leai_used_quota,
      leai_userId,
    });

    return new Response(readable, response);
  } catch (error: any) {
    console.log(error, "openrouter regular error");
    return ResErr({ msg: error?.message || "Error" });
  }
};
