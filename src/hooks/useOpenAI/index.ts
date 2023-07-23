import { create } from "zustand";
import type { OpenAIStore, OpenAI, Azure, Env } from "./types";

const getStorage = (key: string) => {
  const localStore = localStorage.getItem(key);
  try {
    if (localStore) return JSON.parse(localStore);
    return null;
  } catch {
    return null;
  }
};

export const useOpenAIStore = create<OpenAIStore>((set) => ({
  openai: {
    apiKey: "",
    proxy: "",
    temperature: 1,
    max_tokens: 2000,
  },
  azure: {
    apiKey: "",
    resourceName: "",
    temperature: 1,
    max_tokens: 2000,
  },
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

  updateEnv: (env: Env) => {
    set({ env });
  },
}));

export const useOpenAIInit = () => {
  const updateOpenAI = useOpenAIStore((state) => state.updateOpenAI);
  const updateAzure = useOpenAIStore((state) => state.updateAzure);
  const updateEnv = useOpenAIStore((state) => state.updateEnv);

  const init = () => {
    const localOpenAIConfig = getStorage("openaiConfig") || {
      apiKey: "",
      proxy: "",
      temperature: 1,
      max_tokens: 2000,
    };
    const localAzureConfig = getStorage("azureConfig") || {
      apiKey: "",
      resourceName: "",
      temperature: 1,
      max_tokens: 2000,
    };
    updateOpenAI(localOpenAIConfig);
    updateAzure(localAzureConfig);
    updateEnv({
      OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
      AZURE_API_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
    });
  };

  return init;
};
