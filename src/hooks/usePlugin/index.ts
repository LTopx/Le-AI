import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type { PluginStore } from "./types";

const getStorage = (key: string) => {
  const localStore = localStorage.getItem(key);
  try {
    if (localStore) return JSON.parse(localStore);
    return null;
  } catch {
    return null;
  }
};

export const usePluginStore = createWithEqualityFn<PluginStore>(
  (set) => ({
    google_search: {
      enable: false,
      api_key: "",
    },

    updateGoogleSearch: (google_search) => {
      localStorage.setItem("google_search", JSON.stringify(google_search));
      set(() => ({ google_search }));
    },
  }),
  shallow
);

export const usePluginInit = () => {
  const updateGoogleSearch = usePluginStore(
    (state) => state.updateGoogleSearch
  );

  const init = () => {
    const local_google_search = getStorage("google_search") || {
      enable: false,
      api_key: "",
    };

    updateGoogleSearch(local_google_search);
  };

  return init;
};
