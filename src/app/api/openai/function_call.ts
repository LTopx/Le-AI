import { ResErr, isUndefined, sleep, function_call_maps } from "@/lib";
import { calcTokens } from "@/lib/calcTokens";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import { prisma } from "@/lib/prisma";
import { BASE_PRICE } from "@/utils/constant";

type fn_call = keyof typeof function_call_maps;

interface IFunctionCall {
  plugins: fn_call[];
  fetchURL: string;
  Authorization: string;
  model: supportModelType;
  temperature?: number;
  max_tokens?: number;
  modelLabel: supportModelType;
  messages: any[];
  session: any;
  headerApiKey?: string | null;
}

const stream = async (
  readable: ReadableStream,
  writable: WritableStream,
  fetchURL: string,
  messages: any[],
  model: supportModelType,
  tools: fn_call[],
  Authorization: string,
  temperature: number,
  max_tokens: number,
  userId?: string,
  headerApiKey?: string | null
) => {
  const reader = readable.getReader();
  const writer = writable.getWriter();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let streamBuffer = "";
  let content = "";
  let resultContent = "";
  let is_function_call = false;
  let function_call_name = "";
  let function_call_arguments = "";

  while (true) {
    let resultText = "";
    let function_call_result = "";
    const { value, done } = await reader.read();
    if (done) break;

    content += decoder.decode(value);
    streamBuffer += decoder.decode(value, { stream: true });

    const contentLines = content.split(newline).filter((item) => item?.trim());
    const lines = streamBuffer.split(delimiter);

    for (const contentLine of contentLines) {
      const message = contentLine.replace(/^data: /, "");
      if (message !== "[DONE]") {
        try {
          const delta = JSON.parse(message).choices[0].delta;
          if (delta.content) resultText += delta.content;
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
      for (let i = 0; i < lines.length - 1; i++) {
        await writer.write(encoder.encode(lines[i] + delimiter));
        await sleep(20);
      }
    }

    resultContent = resultText;
    streamBuffer = lines[lines.length - 1];
    function_call_arguments = function_call_result;
  }

  // If use own key, no need to calculate tokens
  if (userId && !headerApiKey) {
    const final = [...messages, { role: "assistant", content: resultContent }];

    const { usedTokens, usedUSD } = calcTokens(final, model);

    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (findUser) {
      const costTokens = findUser.costTokens + usedTokens;
      const costUSD = Number((findUser.costUSD + usedUSD).toFixed(5));
      const availableTokens =
        findUser.availableTokens - Math.ceil(usedUSD * BASE_PRICE);

      await prisma.user.update({
        where: { id: userId },
        data: {
          costTokens,
          costUSD,
          availableTokens,
        },
      });
    }
  }

  if (!is_function_call) {
    if (streamBuffer) await writer.write(encoder.encode(streamBuffer));
    await writer.write(encodedNewline);
    await writer.close();
  } else {
    const { keyword } = JSON.parse(function_call_arguments);

    const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;
    const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;

    const url =
      "https://www.googleapis.com/customsearch/v1?" +
      `key=${GOOGLE_SEARCH_API_KEY}` +
      `&cx=${GOOGLE_SEARCH_ENGINE_ID}` +
      `&q=${encodeURIComponent(keyword)}`;

    const data = await fetch(url).then((res) => res.json());
    const results =
      data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) ?? [];

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
        content: JSON.stringify({ result: JSON.stringify(results) }),
      },
    ];

    let function_call_streamBuffer = "";
    let function_call_content = "";
    let function_call_resultContent = "";

    const function_call_response = await fetch(fetchURL, {
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
        messages: newMessages,
        functions: [function_call_maps[tools[0]]],
      }),
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
    if (userId && !headerApiKey) {
      const final = [
        ...messages,
        { role: "assistant", content: function_call_resultContent },
      ];

      const { usedTokens, usedUSD } = calcTokens(final, model);

      const findUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (findUser) {
        const costTokens = findUser.costTokens + usedTokens;
        const costUSD = Number((findUser.costUSD + usedUSD).toFixed(5));
        const availableTokens =
          findUser.availableTokens - Math.ceil(usedUSD * BASE_PRICE);

        await prisma.user.update({
          where: { id: userId },
          data: {
            costTokens,
            costUSD,
            availableTokens,
          },
        });
      }
    }

    if (function_call_streamBuffer) {
      await writer.write(encoder.encode(function_call_streamBuffer));
    }

    await writer.write(encodedNewline);
    await writer.close();
  }
};

export const function_call = async ({
  plugins,
  fetchURL,
  Authorization,
  model,
  temperature,
  max_tokens,
  messages,
  modelLabel,
  session,
  headerApiKey,
}: IFunctionCall) => {
  try {
    const params_temperature = isUndefined(temperature) ? 1 : temperature;
    const params_max_tokens = isUndefined(max_tokens) ? 2000 : max_tokens;

    const response = await fetch(fetchURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Authorization}`,
      },
      method: "POST",
      body: JSON.stringify({
        stream: true,
        model,
        temperature: params_temperature,
        max_tokens: params_max_tokens,
        messages,
        // Temporary support for individual tools.
        functions: [function_call_maps[plugins[0]]],
      }),
    });

    if (response.status !== 200) {
      return new Response(response.body, { status: 500 });
    }

    const { readable, writable } = new TransformStream();

    stream(
      response.body as ReadableStream,
      writable,
      fetchURL,
      messages,
      modelLabel,
      plugins,
      Authorization,
      params_temperature,
      params_max_tokens,
      session?.user.id,
      headerApiKey
    );

    return new Response(readable, response);
  } catch (error: any) {
    console.log(error, "openai error");
    return ResErr({ msg: error?.message || "Error" });
  }
};
