import { create } from "zustand";

type State = {
  open: boolean;
};

type Action = {
  update: (firstName: State["open"]) => void;
};

/** is Mobile Menu Open */
export const useMobileMenuOpen = create<State & Action>((set) => ({
  open: false,
  update: (open: boolean) => set(() => ({ open })),
}));
