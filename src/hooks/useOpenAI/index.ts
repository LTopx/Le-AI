import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type { OpenAIStore, OpenAI, Azure, OpenRouter, Env } from "./types";

const getStorage = (key: string) => {
  const localStore = localStorage.getItem(key);
  try {
    if (localStore) return JSON.parse(localStore);
    return null;
  } catch {
    return null;
  }
};

export const useOpenAIStore = createWithEqualityFn<OpenAIStore>(
  (set) => ({
    openai: {
      apiKey: "",
      proxy: "",
      temperature: 1,
      max_tokens: 1000,
    },
    azure: {
      apiKey: "",
      resourceName: "",
      temperature: 1,
      max_tokens: 1000,
    },
    openRouter: {
      apiKey: "",
      temperature: 1,
      max_tokens: 1000,
    },
    leAIKey: "",
    env: {
      OPENAI_API_KEY: "",
      AZURE_API_KEY: "",
    },

    updateOpenAI: (openai: OpenAI) => {
      localStorage.setItem("openaiConfig", JSON.stringify(openai));
      set({ openai });
    },

    updateAzure: (azure: Azure) => {
      localStorage.setItem("azureConfig", JSON.stringify(azure));
      set({ azure });
    },

    updateOpenRouter: (openRouter: OpenRouter) => {
      localStorage.setItem("openRouterConfig", JSON.stringify(openRouter));
      set({ openRouter });
    },

    updateLeAIKey: (leAIKey) => {
      localStorage.setItem("leAIKey", leAIKey);
      set({ leAIKey });
    },

    updateEnv: (env: Env) => {
      set({ env });
    },
  }),
  shallow
);

export const useOpenAIInit = () => {
  const updateOpenAI = useOpenAIStore((state) => state.updateOpenAI);
  const updateAzure = useOpenAIStore((state) => state.updateAzure);
  const updateOpenRouter = useOpenAIStore((state) => state.updateOpenRouter);
  const updateLeAIKey = useOpenAIStore((state) => state.updateLeAIKey);
  const updateEnv = useOpenAIStore((state) => state.updateEnv);

  const init = () => {
    const localOpenAIConfig = getStorage("openaiConfig") || {
      apiKey: "",
      proxy: "",
      temperature: 1,
      max_tokens: 1000,
    };
    const localAzureConfig = getStorage("azureConfig") || {
      apiKey: "",
      resourceName: "",
      temperature: 1,
      max_tokens: 1000,
    };
    const localOpenRouterConfig = getStorage("openRouterConfig") || {
      apiKey: "",
      temperature: 1,
      max_tokens: 1000,
    };
    const localLeAIKey = localStorage.getItem("leAIKey") || "";
    updateOpenAI(localOpenAIConfig);
    updateAzure(localAzureConfig);
    updateOpenRouter(localOpenRouterConfig);
    updateLeAIKey(localLeAIKey);
    updateEnv({
      OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
      AZURE_API_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
    });
  };

  return init;
};
