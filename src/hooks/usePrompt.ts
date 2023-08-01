import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
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

type PromptStore = {
  list: IPrompt[];
  updateList: (list: IPrompt[]) => void;
};

export const usePromptStore = createWithEqualityFn<PromptStore>(
  (set) => ({
    list: [],

    updateList: (list) => {
      localStorage.setItem("promptList", JSON.stringify(list));
      set({ list });
    },
  }),
  shallow
);

export const usePromptInit = () => {
  const updateList = usePromptStore((state) => state.updateList);

  const init = () => {
    try {
      const localList = localStorage.getItem("promptList");
      if (localList) updateList(JSON.parse(localList));
    } catch (error) {
      console.log(error, "error");
    }
  };

  return init;
};
