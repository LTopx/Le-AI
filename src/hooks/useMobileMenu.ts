import { create } from "zustand";

interface IMobileMenu {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<IMobileMenu>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const useMobileMenu = (): [
  IMobileMenu["visible"],
  IMobileMenu["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
