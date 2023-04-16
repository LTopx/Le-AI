import { create } from "zustand";

type LoadingState = {
  loadingResponseStart: boolean;
  loadingResponseFinish: boolean;
};

type LoadingAction = {
  updateStart: (loading: LoadingState["loadingResponseStart"]) => void;
  updateFinish: (loading: LoadingState["loadingResponseFinish"]) => void;
};

export const useChatLoading = create<LoadingState & LoadingAction>((set) => ({
  /** loading until gpt response start */
  loadingResponseStart: false,

  /** loading until gpt response finished */
  loadingResponseFinish: false,

  updateStart: (loadingResponseStart: boolean) =>
    set(() => ({ loadingResponseStart })),

  updateFinish: (loadingResponseFinish: boolean) =>
    set(() => ({ loadingResponseFinish })),
}));

type AbortState = {
  abort: AbortController | null;
};

type AbortAction = {
  update: (abort: AbortState["abort"]) => void;
};

export const useChatAbort = create<AbortState & AbortAction>((set) => ({
  abort: null,

  update: (abort: AbortState["abort"]) => set(() => ({ abort })),
}));
