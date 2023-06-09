import * as React from "react";
import { create } from "zustand";
import type { IPrompt } from "./usePrompt";

type SavePrompt =
  | IPromptRecentState
  | ((prev: IPromptRecentState) => IPromptRecentState);

interface IPromptRecentState {
  list: IPrompt[];
}

interface IPromptRecentAction {
  updateList: (args: SavePrompt) => void;
}

const useStore = create<IPromptRecentState & IPromptRecentAction>((set) => ({
  list: [],

  updateList: (args: SavePrompt) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(JSON.stringify({ list: state.list }));
        const { list } = args(newState);
        localStorage.setItem("prompt-recent", JSON.stringify(list));
        return { list };
      });
    } else {
      const { list } = args;
      localStorage.setItem("promptList", JSON.stringify(list));
      set(() => ({ list }));
    }
  },
}));

export const usePromptRecent = (): [
  IPromptRecentState["list"],
  IPromptRecentAction["updateList"]
] => {
  const { list } = useStore();

  const updateList = useStore((state) => state.updateList);

  React.useEffect(() => {
    try {
      const localList = localStorage.getItem("prompt-recent");
      if (localList) updateList({ list: JSON.parse(localList) });
    } catch {}
  }, []);

  return [list, updateList];
};
