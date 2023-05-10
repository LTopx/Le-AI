import { create } from "zustand";

interface IChat {
  loadingResponseStart: boolean;
  loadingResponseFinish: boolean;
  abort: AbortController | null;

  updateStart: (loading: boolean) => void;
  updateFinish: (loading: boolean) => void;
  updateAbort: (abort: AbortController | null) => void;
}

const useStore = create<IChat>((set) => ({
  /** loading until gpt response start */
  loadingResponseStart: false,

  /** loading until gpt response finished */
  loadingResponseFinish: false,

  abort: null,

  updateStart: (loadingResponseStart: boolean) =>
    set(() => ({ loadingResponseStart })),

  updateFinish: (loadingResponseFinish: boolean) =>
    set(() => ({ loadingResponseFinish })),

  updateAbort: (abort: AbortController | null) => set(() => ({ abort })),
}));

export const useChat = () => {
  const { loadingResponseStart, loadingResponseFinish, abort } = useStore();

  const updateStart = useStore((state) => state.updateStart);
  const updateFinish = useStore((state) => state.updateFinish);
  const updateAbort = useStore((state) => state.updateAbort);

  return {
    loadingResponseStart,
    loadingResponseFinish,
    abort,
    updateStart,
    updateFinish,
    updateAbort,
  };
};
