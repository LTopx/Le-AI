document.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches && event.touches.length > 1) {
      // 禁止多指觸控
      event.preventDefault();
    }
  },
  { passive: false }
);
