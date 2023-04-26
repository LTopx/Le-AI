/**
 * Manage the OpenAI params
 */
import * as React from "react";
import { create } from "zustand";

type State = {
  openAIKey: string;
  envOpenAIKey: string;
  /**
   * What sampling temperature to use, between 0 and 2.
   * Higher values like 0.8 will make the output more random,
   * while lower values like 0.2 will make it more focused and deterministic.
   * @default 1
   */
  temperature: number;

  /**
   * The maximum number of tokens to generate in the chat completion.
   * The total length of input tokens and generated tokens is limited by the model's context length.
   * gpt3.5 max tokens is 4097
   * @default 2000
   */
  max_tokens: number;

  /**
   * ID of the model to use
   */
  model: string;
};

export type StateOpenAI = Omit<State, "envOpenAIKey">;

type SaveOpenAI = StateOpenAI | ((prev: StateOpenAI) => StateOpenAI);

type Action = {
  update: (args: SaveOpenAI) => void;
  updateEnvOpenAIKey: (value: State["envOpenAIKey"]) => void;
};

export type UseOpenAIReturn = [State, (args: SaveOpenAI) => void];

const modelOptions = [
  {
    label: "gpt-3.5-turbo-0301",
    value: "gpt-3.5-turbo-0301",
  },
  {
    label: "gpt-3.5-turbo",
    value: "gpt-3.5-turbo",
  },
];

const useStore = create<State & Action>((set) => ({
  openAIKey: "",
  envOpenAIKey: "",
  temperature: 1,
  max_tokens: 2000,
  model: "gpt-3.5-turbo",

  update: (args: SaveOpenAI) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(
          JSON.stringify({
            openAIKey: state.openAIKey,
            model: state.model,
            temperature: state.temperature,
            max_tokens: state.max_tokens,
          })
        );
        const { openAIKey, model, temperature, max_tokens } = args(newState);
        localStorage.setItem("openaiKey", openAIKey);
        localStorage.setItem("language_model", model);
        localStorage.setItem("temperature", String(temperature));
        localStorage.setItem("max_tokens", String(max_tokens));
        return { openAIKey, model, temperature, max_tokens };
      });
    } else {
      const { openAIKey, model, temperature, max_tokens } = args;
      localStorage.setItem("openaiKey", openAIKey);
      localStorage.setItem("language_model", model);
      localStorage.setItem("temperature", String(temperature));
      localStorage.setItem("max_tokens", String(max_tokens));
      set(() => ({ openAIKey, model, temperature, max_tokens }));
    }
  },
  updateEnvOpenAIKey: (envOpenAIKey) => {
    set(() => ({ envOpenAIKey }));
  },
}));

const useOpenAI = (): UseOpenAIReturn => {
  const { openAIKey, model, envOpenAIKey, temperature, max_tokens } = useStore(
    (state) => state
  );

  const update = useStore((state) => state.update);

  const updateEnvOpenAIKey = useStore((state) => state.updateEnvOpenAIKey);

  React.useEffect(() => {
    const localOpenaiKey = localStorage.getItem("openaiKey") || "";
    const localTemperature = Number(localStorage.getItem("temperature") || "1");
    const localMaxToken = Number(localStorage.getItem("max_tokens") || "2000");
    const localModel =
      localStorage.getItem("language_model") || "gpt-3.5-turbo";

    update({
      openAIKey: localOpenaiKey,
      temperature: isNaN(localTemperature) ? 1 : localTemperature,
      max_tokens: isNaN(localMaxToken) ? 2000 : localMaxToken,
      model: localModel,
    });
    updateEnvOpenAIKey(process.env.NEXT_PUBLIC_OPENAI_API_KEY || "");
  }, []);

  return [
    {
      openAIKey,
      model,
      envOpenAIKey,
      temperature,
      max_tokens,
    },
    update,
  ];
};

export { useOpenAI, modelOptions };
