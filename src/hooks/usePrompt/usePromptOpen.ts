import { create } from "zustand";

interface IPromptOpenStore {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<IPromptOpenStore>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const usePromptOpen = (): [
  IPromptOpenStore["visible"],
  IPromptOpenStore["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
