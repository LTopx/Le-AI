"use client";

import { createWithEqualityFn } from "zustand/traditional";
import Image from "next/image";
import { shallow } from "zustand/shallow";
import Icon from "@/components/icon";
import type { LLMStore } from "./types";

export const PREMIUM_MODELS = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0613",
  "Claude v2",
  "PaLM 2 Bison",
  "Llama v2 13B",
  "Llama v2 70B",
];

export const useLLMStore = createWithEqualityFn<LLMStore>(
  (set) => ({
    openai: {
      label: "OpenAI",
      value: "openai",
      ico: <Icon icon="openai" style={{ color: "#71a697" }} size={16} />,
      ico_big: <Icon icon="openai" style={{ color: "#71a697" }} size={32} />,
      models: [
        {
          label: "gpt-3.5-turbo",
          value: "gpt-3.5-turbo",
        },
        {
          label: "gpt-3.5-turbo-0613",
          value: "gpt-3.5-turbo-0613",
        },
        {
          label: "gpt-3.5-turbo-16k",
          value: "gpt-3.5-turbo-16k",
        },
        {
          label: "gpt-3.5-turbo-16k-0613",
          value: "gpt-3.5-turbo-16k-0613",
        },
        {
          label: "gpt-4",
          value: "gpt-4",
          premium: true,
        },
        {
          label: "gpt-4-0613",
          value: "gpt-4-0613",
          premium: true,
        },
        {
          label: "gpt-4-32k",
          value: "gpt-4-32k",
          premium: true,
        },
        {
          label: "gpt-4-32k-0613",
          value: "gpt-4-32k-0613",
          premium: true,
        },
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
    openRouter: {
      label: "OpenRouter",
      value: "openRouter",
      ico: <Icon icon="open_router" size={16} />,
      ico_big: <Icon icon="open_router" size={32} />,
      models: [
        {
          label: "Claude Instant v1",
          value: "anthropic/claude-instant-v1",
          icon: (
            <Image src="/claude.webp" alt="Claude" width={16} height={16} />
          ),
        },
        {
          label: "Claude v2",
          value: "anthropic/claude-2",
          premium: true,
          icon: (
            <Image src="/claude.webp" alt="Claude" width={16} height={16} />
          ),
        },
        {
          label: "PaLM 2 Bison",
          value: "google/palm-2-chat-bison",
          premium: true,
          icon: <Image src="/palm.webp" alt="PaLM" width={16} height={16} />,
        },
        {
          label: "Llama v2 13B",
          value: "meta-llama/llama-2-13b-chat",
          premium: true,
          icon: <div>🦙</div>,
        },
        {
          label: "Llama v2 70B",
          value: "meta-llama/llama-2-70b-chat",
          premium: true,
          icon: <div>🦙</div>,
        },
      ],
    },

    updateAzure: (models) => {
      localStorage.setItem("azureModels", JSON.stringify(models));
      set((state) => ({ azure: { ...state.azure, models } }));
    },
  }),
  shallow
);

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
