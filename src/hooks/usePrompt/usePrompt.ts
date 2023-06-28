import React from "react";
import { create } from "zustand";
import type { Prompt } from "@prisma/client";

export type IPrompt = Omit<
  Prompt,
  | "creator"
  | "status"
  | "like"
  | "usageCount"
  | "type"
  | "createdAt"
  | "updatedAt"
  | "creatorName"
  | "creatorEmail"
>;

type SavePrompt = IPromptState | ((prev: IPromptState) => IPromptState);

interface IPromptState {
  list: IPrompt[];
}

interface IPromptAction {
  updateList: (args: SavePrompt) => void;
}

const useStore = create<IPromptState & IPromptAction>((set) => ({
  list: [],

  updateList: (args: SavePrompt) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(JSON.stringify({ list: state.list }));
        const { list } = args(newState);
        localStorage.setItem("promptList", JSON.stringify(list));
        return { list };
      });
    } else {
      const { list } = args;
      localStorage.setItem("promptList", JSON.stringify(list));
      set(() => ({ list }));
    }
  },
}));

export const usePrompt = (): [
  IPromptState["list"],
  IPromptAction["updateList"]
] => {
  const { list } = useStore();

  const updateList = useStore((state) => state.updateList);

  React.useEffect(() => {
    try {
      const localList = localStorage.getItem("promptList");
      if (localList) updateList({ list: JSON.parse(localList) });
    } catch {}
  }, []);

  return [list, updateList];
};
