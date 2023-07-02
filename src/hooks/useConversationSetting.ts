import { create } from "zustand";

interface IConversationStore {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<IConversationStore>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const useConversationSetting = (): [
  IConversationStore["visible"],
  IConversationStore["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
