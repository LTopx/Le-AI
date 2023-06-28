import React from "react";
import { create } from "zustand";

interface IScrollToBottom {
  scrollEle: HTMLDivElement | null;
  updateScrollEle: (scrollEle: HTMLDivElement | null) => void;
}

const useStore = create<IScrollToBottom>((set) => ({
  scrollEle: null,

  updateScrollEle: (scrollEle) => set({ scrollEle }),
}));

export function useScrollToBottom() {
  const { scrollEle } = useStore();

  const updateScrollEle = useStore((state) => state.updateScrollEle);

  const scrollToBottom = React.useCallback(() => {
    if (!scrollEle) return;
    requestAnimationFrame(() => scrollEle.scrollTo(0, scrollEle.scrollHeight));
  }, [scrollEle]);

  return {
    scrollEle,
    updateScrollEle,
    scrollToBottom,
  };
}
