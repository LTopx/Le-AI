import { ResErr, isUndefined, function_call_maps } from "@/lib";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import { stream } from "@/lib/stream";
import type { IFetchOpenAI } from "./types";

type fn_call = keyof typeof function_call_maps;

interface IFunctionCall extends IFetchOpenAI {
  plugins: fn_call[];
  modelLabel: supportModelType;
  userId?: string;
  headerApiKey?: string;
  leaiApiKey?: string;
  leai_used_quota?: number;
  leai_userId?: string;
}

const fetchOpenAI = async ({
  fetchURL,
  Authorization,
  model,
  temperature,
  max_tokens,
  messages,
  plugins,
}: IFetchOpenAI & { plugins: fn_call[] }) => {
  return await fetch(fetchURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
    },
    method: "POST",
    body: JSON.stringify({
      stream: true,
      model,
      temperature,
      max_tokens,
      messages,
      // Temporary support for individual tools.
      functions: [function_call_maps[plugins[0]]],
    }),
  });
};

export const function_call = async ({
  plugins,
  messages,
  fetchURL,
  Authorization,
  model,
  modelLabel,
  temperature: p_temperature,
  max_tokens: p_max_tokens,
  userId,
  headerApiKey,
  leaiApiKey,
  leai_used_quota,
  leai_userId,
}: IFunctionCall) => {
  try {
    const temperature = isUndefined(p_temperature) ? 1 : p_temperature;
    const max_tokens = isUndefined(p_max_tokens) ? 1000 : p_max_tokens;

    const response = await fetchOpenAI({
      fetchURL,
      Authorization,
      model,
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
      model,
      modelLabel,
      plugins,
      fetchURL,
      Authorization,
      temperature,
      max_tokens,
      fetchFn: fetchOpenAI,
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
    console.log(error, "openai function_call error");
    return ResErr({ msg: error?.message || "Error" });
  }
};
