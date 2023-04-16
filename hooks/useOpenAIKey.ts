/**
 * Manage the OpenAI key
 */

import * as React from "react";
import { create } from "zustand";

type State = {
  openAIKey: string;
};

type Action = {
  update: (firstName: State["openAIKey"]) => void;
};

export type UseOpenAIKeyReturn = [string, (key: string) => void];

const useStore = create<State & Action>((set) => ({
  openAIKey: "",
  update: (openAIKey) => {
    localStorage.setItem("openaiKey", openAIKey);
    set(() => ({ openAIKey }));
  },
}));

const useOpenAIKey = (): UseOpenAIKeyReturn => {
  const openAIKey = useStore((state) => state.openAIKey);
  const updateOpenAIKey = useStore((state) => state.update);

  React.useEffect(() => {
    const localOpenaiKey = localStorage.getItem("openaiKey") || "";
    updateOpenAIKey(localOpenaiKey);
  }, []);

  return [openAIKey, updateOpenAIKey];
};

export { useOpenAIKey };
