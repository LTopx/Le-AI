import { create } from "zustand";

interface IRechargeStore {
  visible: boolean;
  update: (visible: boolean) => void;
}

const useStore = create<IRechargeStore>((set) => ({
  visible: false,
  update: (visible) => set({ visible }),
}));

export const useRecharge = (): [
  IRechargeStore["visible"],
  IRechargeStore["update"]
] => {
  const { visible } = useStore();

  const update = useStore((state) => state.update);

  return [visible, update];
};
