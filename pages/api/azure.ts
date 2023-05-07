import { isUndefined } from "@/utils";
import { AI_MODELS } from "@/utils/models";

export const config = {
  runtime: "edge",
};

const apiVersion = "2023-03-15-preview";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// support printer mode and add newline
async function stream(readable: ReadableStream, writable: WritableStream) {
  const reader = readable.getReader();
  const writer = writable.getWriter();

  // const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  // let decodedValue = decoder.decode(value);
  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let buffer = "";
  while (true) {
    let { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true }); // stream: true is important here,fix the bug of incomplete line
    let lines = buffer.split(delimiter);

    // Loop through all but the last line, which may be incomplete.
    for (let i = 0; i < lines.length - 1; i++) {
      await writer.write(encoder.encode(lines[i] + delimiter));
      await sleep(30);
    }

    buffer = lines[lines.length - 1];
  }

  if (buffer) {
    await writer.write(encoder.encode(buffer));
  }
  await writer.write(encodedNewline);
  await writer.close();
}

const handler = async (req: Request) => {
  // first use local
  // then use env configuration
  // or empty
  const Authorization =
    req.headers.get("Authorization") ||
    process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY ||
    "";

  if (!Authorization) {
    return new Response("Error", {
      status: 500,
      statusText: "Missing API Key",
    });
  }

  const {
    model,
    temperature,
    max_tokens,
    prompt,
    resourceName: name,
    chat_list,
  } = await req.json();

  const resourceName =
    name || process.env.NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME;

  const findModel = AI_MODELS.find((item) => {
    return item.models.find((val) => val.value === model);
  });

  if (!findModel) {
    return new Response("Error", {
      status: 500,
      statusText: "Language model parameters are incorrect",
    });
  }

  const fetchURL = `https://${resourceName}.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`;

  const messages = [...chat_list];

  if (prompt) messages.unshift({ role: "system", content: prompt });

  try {
    const response = await fetch(fetchURL, {
      headers: {
        "Content-Type": "application/json",
        "api-key": Authorization,
      },
      method: "POST",
      body: JSON.stringify({
        frequency_penalty: 0,
        max_tokens: isUndefined(max_tokens) ? 2000 : max_tokens,
        messages,
        presence_penalty: 0,
        stop: null,
        stream: true,
        temperature: isUndefined(temperature) ? 1 : temperature,
      }),
    });

    const { readable, writable } = new TransformStream();

    stream(response.body as ReadableStream, writable);

    return new Response(readable, response);
  } catch (error: any) {
    console.log(error, "azure error");
    return new Response("Error", { status: 500 });
  }
};

export default handler;
