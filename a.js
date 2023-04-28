addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const config = {
  openai: {
    originUrl: "https://api.openai.com",
  },
  azure: {
    apiVersion: "2023-03-15-preview",
    // The name of your Azure OpenAI Resource.
    resourceName: "lgpt-azure-openai",
    // The deployment name you chose when you deployed the model.
    model: {
      "gpt-3.5-turbo-0301": "lgpt-35-turbo",
    },
  },
};

async function handleRequest(request) {
  if (
    !request.url.includes("openai-proxy") &&
    !request.url.includes("azure-proxy")
  ) {
    return new Response("404 Not Found", { status: 404 });
  }

  if (request.method === "OPTIONS") return handleOPTIONS(request);

  if (request.url.includes("openai-proxy")) {
    return handleOpenAI(request);
  } else if (request.url.includes("azure-proxy")) {
    return handleAzure(request);
  }
}

async function handleOpenAI(request) {
  const url = new URL(request.url);

  url.host = config.openai.originUrl.replace(/^https?:\/\//, "");

  const modifiedRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: "follow",
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  // 添加允许跨域访问的响应头
  modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");

  return modifiedResponse;
}

async function handleAzure(request) {
  const url = new URL(request.url);

  if (url.pathname === "/v1/chat/completions") {
    var path = "chat/completions";
  } else if (url.pathname === "/v1/completions") {
    var path = "completions";
  } else if (url.pathname === "/v1/models") {
    return handleModels(request);
  } else {
    return new Response("404 Not Found", { status: 404 });
  }

  let body;
  if (request.method === "POST") body = await request.json();

  const modelName = body?.model;
  const deployName = config.azure.model[modelName];

  if (deployName === "") return new Response("Missing model", { status: 403 });

  const fetchAPI = `https://${config.azure.resourceName}.openai.azure.com/openai/deployments/${deployName}/${path}?api-version=${config.azure.apiVersion}`;

  const authKey = request.headers.get("Authorization");

  if (!authKey) return new Response("Not allowed", { status: 403 });

  const payload = {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      "api-key": authKey.replace("Bearer ", ""),
    },
    body: typeof body === "object" ? JSON.stringify(body) : "{}",
  };

  const response = await fetch(fetchAPI, payload);

  if (body?.stream != true) {
    return response;
  }

  const { readable, writable } = new TransformStream();
  stream(response.body, writable);
  return new Response(readable, response);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// support printer mode and add newline
async function stream(readable, writable) {
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

async function handleModels() {
  const data = {
    object: "list",
    data: [],
  };

  for (let key in config.azure.model) {
    data.data.push({
      id: key,
      object: "model",
      created: 1677610602,
      owned_by: "openai",
      permission: [
        {
          id: "modelperm-M56FXnG1AsIr3SXq8BYPvXJA",
          object: "model_permission",
          created: 1679602088,
          allow_create_engine: false,
          allow_sampling: true,
          allow_logprobs: true,
          allow_search_indices: false,
          allow_view: true,
          allow_fine_tuning: false,
          organization: "*",
          group: null,
          is_blocking: false,
        },
      ],
      root: key,
      parent: null,
    });
  }

  const json = JSON.stringify(data, null, 2);
  return new Response(json, {
    headers: { "Content-Type": "application/json" },
  });
}

async function handleOPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
