import { create } from "zustand";

export type ScrollToBottomStore = {
  scrollEle: HTMLDivElement | null;
  updateScrollEle: (scrollEle: HTMLDivElement | null) => void;
  scrollToBottom: () => void;
};

export const useScrollToBottomStore = create<ScrollToBottomStore>((set) => ({
  scrollEle: null,

  updateScrollEle: (scrollEle) => set({ scrollEle }),

  scrollToBottom: () => {
    set((state) => {
      const { scrollEle } = state;
      if (scrollEle) {
        requestAnimationFrame(() =>
          scrollEle.scrollTo(0, scrollEle.scrollHeight)
        );
      }
      return {};
    });
  },
}));
