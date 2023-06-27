import { create } from "zustand";

interface ITTSOpenStore {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<ITTSOpenStore>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const useTTSOpen = (): [
  ITTSOpenStore["visible"],
  ITTSOpenStore["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
