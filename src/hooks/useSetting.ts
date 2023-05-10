import { create } from "zustand";

interface ISettingStore {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<ISettingStore>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const useSetting = (): [
  ISettingStore["visible"],
  ISettingStore["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
