import { create } from "zustand";

export type ConfigStore = {
  sendMessageType: "Enter" | "CommandEnter";

  updateSendMessageType: (
    sendMessageType: ConfigStore["sendMessageType"]
  ) => void;
};

export const useConfigStore = create<ConfigStore>((set) => ({
  sendMessageType: "Enter",

  updateSendMessageType: (sendMessageType) => set({ sendMessageType }),
}));
