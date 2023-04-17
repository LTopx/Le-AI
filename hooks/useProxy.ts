import * as React from "react";
import { create } from "zustand";

type State = {
  proxyUrl: string;
};

type Action = {
  update: (firstName: State["proxyUrl"]) => void;
};

export type UseProxyReturn = [string, (key: string) => void];

const useStore = create<State & Action>((set) => ({
  proxyUrl: "",
  update: (proxyUrl) => {
    localStorage.setItem("proxyUrl", proxyUrl);
    set(() => ({ proxyUrl }));
  },
}));

const useProxy = (): UseProxyReturn => {
  const proxyUrl = useStore((state) => state.proxyUrl);
  const updateProxyUrl = useStore((state) => state.update);

  React.useEffect(() => {
    const localProxyUrl =
      localStorage.getItem("proxyUrl") ||
      process.env.NEXT_PUBLIC_OPENAI_API_PROXY ||
      "";
    updateProxyUrl(localProxyUrl);
  }, []);

  return [proxyUrl, updateProxyUrl];
};

export { useProxy };
