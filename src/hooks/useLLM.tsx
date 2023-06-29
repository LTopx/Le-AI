import React from "react";
import { create } from "zustand";

export const OpenAIIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path
      fill="#71a697"
      d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91a6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9a6.046 6.046 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206a5.99 5.99 0 0 0 3.997-2.9a6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355l-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085l-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"
    />
  </svg>
);

export const AzureIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 128 128"
  >
    <defs>
      <linearGradient
        id="deviconAzure0"
        x1="60.919"
        x2="18.667"
        y1="9.602"
        y2="134.423"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#114A8B" />
        <stop offset="1" stopColor="#0669BC" />
      </linearGradient>
      <linearGradient
        id="deviconAzure1"
        x1="74.117"
        x2="64.344"
        y1="67.772"
        y2="71.076"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity=".3" />
        <stop offset=".071" stopOpacity=".2" />
        <stop offset=".321" stopOpacity=".1" />
        <stop offset=".623" stopOpacity=".05" />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="deviconAzure2"
        x1="68.742"
        x2="115.122"
        y1="5.961"
        y2="129.525"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3CCBF4" />
        <stop offset="1" stopColor="#2892DF" />
      </linearGradient>
    </defs>
    <path
      fill="url(#deviconAzure0)"
      d="M46.09.002h40.685L44.541 125.137a6.485 6.485 0 0 1-6.146 4.413H6.733a6.482 6.482 0 0 1-5.262-2.699a6.474 6.474 0 0 1-.876-5.848L39.944 4.414A6.488 6.488 0 0 1 46.09 0z"
      transform="translate(.587 4.468) scale(.91904)"
    />
    <path
      fill="#0078d4"
      d="M97.28 81.607H37.987a2.743 2.743 0 0 0-1.874 4.751l38.1 35.562a5.991 5.991 0 0 0 4.087 1.61h33.574z"
    />
    <path
      fill="url(#deviconAzure1)"
      d="M46.09.002A6.434 6.434 0 0 0 39.93 4.5L.644 120.897a6.469 6.469 0 0 0 6.106 8.653h32.48a6.942 6.942 0 0 0 5.328-4.531l7.834-23.089l27.985 26.101a6.618 6.618 0 0 0 4.165 1.519h36.396l-15.963-45.616l-46.533.011L86.922.002z"
      transform="translate(.587 4.468) scale(.91904)"
    />
    <path
      fill="url(#deviconAzure2)"
      d="M98.055 4.408A6.476 6.476 0 0 0 91.917.002H46.575a6.478 6.478 0 0 1 6.137 4.406l39.35 116.594a6.476 6.476 0 0 1-6.137 8.55h45.344a6.48 6.48 0 0 0 6.136-8.55z"
      transform="translate(.587 4.468) scale(.91904)"
    />
  </svg>
);

export interface Model {
  label: string;
  value: string;
  premium?: boolean;
}

interface ILLM {
  label: string;
  value: string;
  ico: React.ReactNode;
  ico_big: React.ReactNode;
  models: Model[];
}

interface LLMState {
  openai: ILLM;
  azure: ILLM;
}

interface LLMAction {
  updateAzure: (value: Model[]) => void;
}

interface UseLLMReturn {
  openai: ILLM;
  azure: ILLM;
  updateAzure: LLMAction["updateAzure"];
}

export const PREMIUM_MODELS = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0613",
];

const useStore = create<LLMState & LLMAction>((set) => ({
  openai: {
    label: "OpenAI",
    value: "openai",
    ico: <OpenAIIcon size={16} />,
    ico_big: <OpenAIIcon size={32} />,
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
    ico: <AzureIcon size={16} />,
    ico_big: <AzureIcon size={32} />,
    models: [
      // system default
      { label: "gpt-3.5-turbo", value: "lgpt-35-turbo" },
      { label: "gpt-4", value: "gpt-4", premium: true },
      { label: "gpt-4-32k", value: "gpt-4-32k", premium: true },
    ],
  },
  updateAzure: (models: Model[]) => {
    localStorage.setItem("azureModels", JSON.stringify(models));
    set((state) => ({ azure: { ...state.azure, models } }));
  },
}));

export const useLLM = (): UseLLMReturn => {
  const { openai, azure } = useStore();

  const updateAzure = useStore((state) => state.updateAzure);

  React.useEffect(() => {
    try {
      const localAzureModels = localStorage.getItem("azureModels");
      if (localAzureModels)
        updateAzure(
          JSON.parse(localAzureModels).sort((x: any, y: any) =>
            x.label.localeCompare(y.label)
          )
        );
    } catch {}
  }, []);

  return { openai, azure, updateAzure };
};
