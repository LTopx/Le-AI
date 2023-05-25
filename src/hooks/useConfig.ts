import * as React from "react";
import { create } from "zustand";

export interface IConfigStoreState {
  sendMessageType: "Enter" | "CommandEnter";
}

interface IConfigStoreAction {
  update: (args: SaveConfig) => void;
}

type SaveConfig =
  | IConfigStoreState
  | ((prev: IConfigStoreState) => IConfigStoreState);

type UseConfigReturn = [IConfigStoreState, (args: SaveConfig) => void];

const useStore = create<IConfigStoreState & IConfigStoreAction>((set) => ({
  sendMessageType: "Enter",

  update: (args: SaveConfig) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(JSON.stringify(state));
        const { sendMessageType } = args(newState);
        localStorage.setItem("sendMessageType", sendMessageType);
        return newState;
      });
    } else {
      const { sendMessageType } = args;
      localStorage.setItem("sendMessageType", sendMessageType);
      set(() => ({ sendMessageType }));
    }
  },
}));

export const useConfig = (): UseConfigReturn => {
  const { sendMessageType } = useStore();

  const update = useStore((state) => state.update);

  React.useEffect(() => {
    const localSendMessageType =
      localStorage.getItem("sendMessageType") || "Enter";

    update({
      sendMessageType:
        localSendMessageType as IConfigStoreState["sendMessageType"],
    });
  }, []);

  return [{ sendMessageType }, update];
};
