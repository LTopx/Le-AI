import { ResErr, isUndefined, function_call_maps } from "@/lib";
import { stream } from "@/lib/stream";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import type { IFetchAzureOpenAI } from "./types";

type fn_call = keyof typeof function_call_maps;

interface IFunctionCall extends IFetchAzureOpenAI {
  modelLabel: supportModelType;
  userId?: string;
  headerApiKey?: string;
  leaiApiKey?: string;
  leai_used_quota?: number;
  leai_userId?: string;
}

const fetchAzureOpenAI = async ({
  fetchURL,
  Authorization,
  temperature,
  max_tokens,
  messages,
  plugins,
}: IFetchAzureOpenAI & { plugins: fn_call[] }) => {
  return await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      "api-key": Authorization,
      "X-Accel-Buffering": "no",
    },
    method: "POST",
    body: JSON.stringify({
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      temperature,
      max_tokens,
      messages,
      stop: null,
      // Temporary support for individual tools.
      functions: [function_call_maps[plugins[0]]],
    }),
  });
};

export const function_call = async ({
  temperature: p_temperature,
  max_tokens: p_max_tokens,
  fetchURL,
  Authorization,
  modelLabel,
  messages,
  plugins,
  userId,
  headerApiKey,
  leaiApiKey,
  leai_used_quota,
  leai_userId,
}: IFunctionCall & { plugins: fn_call[] }) => {
  try {
    const temperature = isUndefined(p_temperature) ? 1 : p_temperature;
    const max_tokens = isUndefined(p_max_tokens) ? 1000 : p_max_tokens;

    const response = await fetchAzureOpenAI({
      fetchURL,
      Authorization,
      temperature,
      max_tokens,
      messages,
      plugins,
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
      modelLabel,
      plugins,
      fetchURL,
      Authorization,
      temperature,
      max_tokens,
      fetchFn: fetchAzureOpenAI,
      leaiApiKey,
      leai_used_quota,
      leai_userId,
    });

    return new Response(readable, {
      ...response,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error: any) {
    console.log(error, "azure openai function_call error");
    return ResErr({ msg: error?.message || "Error" });
  }
};
