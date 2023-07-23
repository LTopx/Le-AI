import { create } from "zustand";
import Icon from "@/components/icon";
import type { LLMStore } from "./types";

export const PREMIUM_MODELS = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0613",
];

export const useLLMStore = create<LLMStore>((set) => ({
  openai: {
    label: "OpenAI",
    value: "openai",
    ico: <Icon icon="openai" style={{ color: "#71a697" }} size={16} />,
    ico_big: <Icon icon="openai" style={{ color: "#71a697" }} size={32} />,
    models: [
      { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
      { label: "gpt-3.5-turbo-0613", value: "gpt-3.5-turbo-0613" },
      { label: "gpt-3.5-turbo-16k", value: "gpt-3.5-turbo-16k" },
      { label: "gpt-3.5-turbo-16k-0613", value: "gpt-3.5-turbo-16k-0613" },
      { label: "gpt-4", value: "gpt-4", premium: true },
      { label: "gpt-4-0613", value: "gpt-4-0613", premium: true },
      { label: "gpt-4-32k", value: "gpt-4-32k", premium: true },
      { label: "gpt-4-32k-0613", value: "gpt-4-32k-0613", premium: true },
    ],
  },
  azure: {
    label: "Azure OpenAI",
    value: "azure",
    ico: <Icon icon="azure" size={16} />,
    ico_big: <Icon icon="azure" size={32} />,
    models: [
      { label: "gpt-3.5-turbo", value: "lgpt-35-turbo" },
      { label: "gpt-3.5-turbo-16k", value: "lgpt-35-turbo-16k" },
      { label: "gpt-4", value: "gpt-4", premium: true },
      { label: "gpt-4-32k", value: "gpt-4-32k", premium: true },
    ],
  },

  updateAzure: (models) => {
    localStorage.setItem("azureModels", JSON.stringify(models));
    set((state) => ({ azure: { ...state.azure, models } }));
  },
}));

export const useLLMInit = () => {
  const updateAzure = useLLMStore((state) => state.updateAzure);

  const init = () => {
    try {
      const localAzureModels = localStorage.getItem("azureModels");
      if (localAzureModels) {
        updateAzure(
          JSON.parse(localAzureModels).sort((x: any, y: any) =>
            x.label.localeCompare(y.label)
          )
        );
      }
    } catch {}
  };

  return init;
};
