import * as React from "react";
import { create } from "zustand";

type StateProxy = {
  openaiProxyUrl: string;
  azureProxyUrl: string;
};

type SaveState = StateProxy | ((prev: StateProxy) => StateProxy);

type Action = {
  update: (params: SaveState) => void;
};

export type UseProxyReturn = [
  { openai: string; azure: string },
  (args: SaveState) => void
];

const useStore = create<StateProxy & Action>((set) => ({
  openaiProxyUrl: "",
  azureProxyUrl: "",
  update: (args: SaveState) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(
          JSON.stringify({
            openaiProxyUrl: state.openaiProxyUrl,
            azureProxyUrl: state.azureProxyUrl,
          })
        );
        const { openaiProxyUrl, azureProxyUrl } = args(newState);
        localStorage.setItem("openaiProxyUrl", openaiProxyUrl);
        localStorage.setItem("azureProxyUrl", azureProxyUrl);
        return { openaiProxyUrl, azureProxyUrl };
      });
    } else {
      const { openaiProxyUrl, azureProxyUrl } = args;
      localStorage.setItem("openaiProxyUrl", openaiProxyUrl);
      localStorage.setItem("azureProxyUrl", azureProxyUrl);
      set(() => ({ openaiProxyUrl, azureProxyUrl }));
    }
  },
}));

const useProxy = (): UseProxyReturn => {
  const openaiProxyUrl = useStore((state) => state.openaiProxyUrl);
  const azureProxyUrl = useStore((state) => state.azureProxyUrl);
  const updateProxyUrl = useStore((state) => state.update);

  React.useEffect(() => {
    const localOpenAIProxyUrl = localStorage.getItem("openaiProxyUrl") || "";
    const localAzureProxyUrl = localStorage.getItem("azureProxyUrl") || "";
    updateProxyUrl({
      openaiProxyUrl: localOpenAIProxyUrl,
      azureProxyUrl: localAzureProxyUrl,
    });
  }, []);

  return [{ openai: openaiProxyUrl, azure: azureProxyUrl }, updateProxyUrl];
};

export { useProxy };
