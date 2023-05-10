import * as React from "react";
import { create } from "zustand";

interface BaseAPI {
  apiKey: string;
  temperature: number;
  max_tokens: number;
}

interface State {
  openai: BaseAPI & { proxy: string };
  azure: BaseAPI & { resourceName: string };
}

interface EnvState {
  OPENAI_API_KEY: string;
  AZURE_API_KEY: string;
}

type SaveOpenAI = State | ((prev: State) => State);

interface Action {
  update: (args: SaveOpenAI) => void;
  updateEnv: (value: EnvState) => void;
}

type UseOpenAIReturn = [State & { env: EnvState }, (args: SaveOpenAI) => void];

const getStorage = (key: string) => {
  const localStore = localStorage.getItem(key);
  try {
    if (localStore) return JSON.parse(localStore);
    return null;
  } catch {
    return null;
  }
};

const useStore = create<State & { env: EnvState } & Action>((set) => ({
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

  update: (args: SaveOpenAI) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(
          JSON.stringify({
            openai: state.openai,
            azure: state.azure,
          })
        );
        const { openai, azure } = args(newState);
        localStorage.setItem("openaiConfig", JSON.stringify(openai));
        localStorage.setItem("azureConfig", JSON.stringify(azure));
        return { openai, azure };
      });
    } else {
      const { openai, azure } = args;
      localStorage.setItem("openaiConfig", JSON.stringify(openai));
      localStorage.setItem("azureConfig", JSON.stringify(azure));
      set(() => ({ openai, azure }));
    }
  },

  updateEnv: (env) => {
    set(() => ({ env }));
  },
}));

const useOpenAI = (): UseOpenAIReturn => {
  const { openai, azure, env } = useStore((state) => state);

  const update = useStore((state) => state.update);

  const updateEnv = useStore((state) => state.updateEnv);

  React.useEffect(() => {
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
    update({
      openai: localOpenAIConfig,
      azure: localAzureConfig,
    });
    updateEnv({
      OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
      AZURE_API_KEY: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
    });
  }, []);

  return [{ openai, azure, env }, update];
};

export { useOpenAI };
