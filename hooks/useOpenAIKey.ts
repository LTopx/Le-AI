/**
 * Manage the OpenAI key
 */

import * as React from "react";
import { create } from "zustand";

type State = {
  openAIKey: string;
  envOpenAIKey: string;
};

type Action = {
  update: (value: State["openAIKey"]) => void;
  updateEnvOpenAIKey: (value: State["envOpenAIKey"]) => void;
};

export type UseOpenAIKeyReturn = [string, (key: string) => void, string];

const useStore = create<State & Action>((set) => ({
  openAIKey: "",
  envOpenAIKey: "",
  update: (openAIKey) => {
    localStorage.setItem("openaiKey", openAIKey);
    set(() => ({ openAIKey }));
  },
  updateEnvOpenAIKey: (envOpenAIKey) => {
    set(() => ({ envOpenAIKey }));
  },
}));

const useOpenAIKey = (): UseOpenAIKeyReturn => {
  const openAIKey = useStore((state) => state.openAIKey);
  const updateOpenAIKey = useStore((state) => state.update);
  // not basicly used
  const envOpenAIKey = useStore((state) => state.envOpenAIKey);
  const updateEnvOpenAIKey = useStore((state) => state.updateEnvOpenAIKey);

  React.useEffect(() => {
    const localOpenaiKey = localStorage.getItem("openaiKey") || "";
    updateOpenAIKey(localOpenaiKey);
    updateEnvOpenAIKey(process.env.NEXT_PUBLIC_OPENAI_API_KEY || "");
  }, []);

  return [openAIKey, updateOpenAIKey, envOpenAIKey];
};

export { useOpenAIKey };
