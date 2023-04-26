import { create } from "zustand";

type State = {
  open: boolean;
};

type Action = {
  update: (open: State["open"]) => void;
};

/** is Setting Menu Open */
export const useSettingOpen = create<State & Action>((set) => ({
  open: false,
  update: (open: boolean) => set(() => ({ open })),
}));
