import { create } from "zustand";

interface IPremiumStore {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<IPremiumStore>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const usePremium = (): [
  IPremiumStore["visible"],
  IPremiumStore["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
