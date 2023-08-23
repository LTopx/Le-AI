import { calcTokens } from "@/lib/calcTokens";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import { function_call_maps } from "@/lib";
import { prisma } from "@/lib/prisma";
import { BASE_PRICE } from "@/utils/constant";
import { google_search } from "./google_search";

type fn_call = keyof typeof function_call_maps;

interface StreamProps {
  readable: ReadableStream;
  writable: WritableStream;
  userId?: string;
  headerApiKey?: string;
  messages: any[];
  model?: string;
  modelLabel: supportModelType;
  plugins?: fn_call[];
  fetchURL?: string;
  Authorization?: string;
  leaiApiKey?: string;
  leai_used_quota?: number;
  temperature?: number;
  max_tokens?: number;
  fetchFn?: any;
  leai_userId?: string;
}

interface ICalcTokens {
  userId?: string;
  headerApiKey?: string;
  leaiApiKey?: string;
  leai_used_quota?: number;
  messages: any[];
  content: string;
  modelLabel: supportModelType;
  leai_userId?: string;
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const calculateTokens = async ({
  userId,
  headerApiKey,
  leaiApiKey,
  leai_used_quota = 0,
  messages,
  content,
  modelLabel,
  leai_userId,
}: ICalcTokens) => {
  let localUserId = userId;

  const final = [...messages, { role: "assistant", content }];
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
};

export const stream = async ({
  readable,
  writable,
  userId,
  headerApiKey,
  messages,
  model,
  modelLabel,
  plugins = [],
  fetchURL,
  Authorization,
  leaiApiKey,
  leai_used_quota,
  temperature,
  max_tokens,
  fetchFn,
  leai_userId,
}: StreamProps) => {
  const reader = readable.getReader();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let streamBuffer = "";
  let streamContent = "";
  let tokenContext = "";

  let is_function_call = false;
  let function_call_name = "";
  let function_call_arguments = "";

  while (true) {
    let context = "";
    let function_call_result = "";
    // Read until the end tag, then exit the loop.
    const { value, done } = await reader.read();
    if (done) break;

    streamBuffer += decoder.decode(value, { stream: true });
    streamContent += decoder.decode(value);

    const contextLines = streamContent
      .split(newline)
      .filter((item) => item?.trim());
    const streamLines = streamBuffer.split(delimiter);

    for (const contextLine of contextLines) {
      const message = contextLine.replace(/^data: /, "");
      if (message !== "[DONE]") {
        try {
          const delta = JSON.parse(message).choices[0].delta;
          if (delta.content) context += delta.content;
          if (delta.function_call) {
            is_function_call = true;
            function_call_result += delta.function_call.arguments || "";
          }
          if (delta.function_call?.name) {
            function_call_name = delta.function_call.name;
          }
        } catch {}
      }
    }

    if (!is_function_call) {
      // Loop through all but the last line, which may be incomplete.
      for (let i = 0; i < streamLines.length - 1; i++) {
        await writer.write(encoder.encode(streamLines[i] + delimiter));
        await sleep(20);
      }
    }

    tokenContext = context;
    streamBuffer = streamLines[streamLines.length - 1];
    function_call_arguments = function_call_result;
  }

  // If use own key, no need to calculate tokens
  await calculateTokens({
    userId,
    headerApiKey,
    leaiApiKey,
    leai_used_quota,
    messages,
    content: tokenContext,
    modelLabel,
    leai_userId,
  });

  if (!is_function_call) {
    if (streamBuffer) await writer.write(encoder.encode(streamBuffer));
    await writer.write(encodedNewline);
    await writer.close();
  } else {
    const { keyword } = JSON.parse(function_call_arguments);
    const results = await google_search(keyword);

    const newMessages = [
      ...messages,
      {
        role: "assistant",
        content: null,
        function_call: {
          name: function_call_name,
          arguments: function_call_arguments,
        },
      },
      {
        role: "function",
        name: function_call_name,
        content: results,
      },
    ];

    let function_call_streamBuffer = "";
    let function_call_content = "";
    let function_call_resultContent = "";

    const function_call_response = await fetchFn({
      fetchURL,
      Authorization,
      model,
      temperature,
      max_tokens,
      messages: newMessages,
      plugins,
    });

    const function_call_reader = (
      function_call_response.body as ReadableStream
    ).getReader();

    while (true) {
      let function_call_resultText = "";
      const { value, done } = await function_call_reader.read();
      if (done) break;

      function_call_content += decoder.decode(value);
      function_call_streamBuffer += decoder.decode(value, { stream: true });

      const lines = function_call_streamBuffer.split(delimiter);
      const contentLines = function_call_content
        .split(newline)
        .filter((item) => item?.trim());

      for (const contentLine of contentLines) {
        const message = contentLine.replace(/^data: /, "");
        if (message !== "[DONE]") {
          try {
            const content = JSON.parse(message).choices[0].delta.content;
            if (content) function_call_resultText += content;
          } catch {}
        }
      }

      for (let i = 0; i < lines.length - 1; i++) {
        await writer.write(encoder.encode(lines[i] + delimiter));
        await sleep(20);
      }

      function_call_resultContent = function_call_resultText;
      function_call_streamBuffer = lines[lines.length - 1];
    }

    // If use own key, no need to calculate tokens
    await calculateTokens({
      userId,
      headerApiKey,
      leaiApiKey,
      leai_used_quota,
      messages: newMessages,
      content: function_call_resultContent,
      modelLabel,
      leai_userId,
    });

    if (function_call_streamBuffer) {
      await writer.write(encoder.encode(function_call_streamBuffer));
    }

    await writer.write(encodedNewline);
    await writer.close();
  }
};
