import { ResErr, isUndefined } from "@/lib";
import { stream } from "@/lib/stream";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import type { IFetchAzureOpenAI } from "./types";

interface IRegular extends IFetchAzureOpenAI {
  prompt?: string;
  model: string;
  modelLabel: supportModelType;
  userId?: string;
  headerApiKey?: string;
}

const fetchAzureOpenAI = async ({
  fetchURL,
  Authorization,
  temperature,
  max_tokens,
  messages,
}: IFetchAzureOpenAI) => {
  return await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      "api-key": Authorization,
    },
    method: "POST",
    body: JSON.stringify({
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      temperature: isUndefined(temperature) ? 1 : temperature,
      max_tokens: isUndefined(max_tokens) ? 1000 : max_tokens,
      messages,
      stop: null,
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
}: IRegular) => {
  if (prompt) messages.unshift({ role: "system", content: prompt });

  try {
    const response = await fetchAzureOpenAI({
      fetchURL,
      Authorization,
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
    });

    return new Response(readable, response);
  } catch (error: any) {
    console.log(error, "azure openai regular error");
    return ResErr({ msg: error?.message || "Error" });
  }
};
