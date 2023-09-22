import { create } from "zustand";

export type SyncStore = {
  size: number;

  updateSize: (size: number) => void;
};

export const syncStore = create<SyncStore>((set) => ({
  size: 0,

  updateSize: (size) => set({ size }),
}));
