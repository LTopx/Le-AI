// lx-ui tailwindcss preset
module.exports = {
  theme: {
    extend: {
      backgroundColor: {
        "lx-color-fill-2": "rgb(242,243,245)",
        "lx-color-fill-2-dark": "hsla(0,0%,100%,0.08)",
        "lx-color-fill-3": "rgb(229,230,235)",
        "lx-color-fill-3-dark": "hsla(0,0%,100%,0.12)",
        "lx-color-fill-4-dark": "hsla(0,0%,100%,0.16)",
      },
      colors: {
        "lx-color-text-1": "#1D2129",
        "lx-color-text-1-dark": "hsla(0,0%,100%,0.9)",
        "lx-color-text-3": "#86909C",
        "lx-color-text-4": "#C9CDD4",
        "lx-color-text-4-dark": "hsla(0,0%,100%,0.3)",
        "lx-color-border-3-dark": "hsla(0,0%,100%,0.12)",
      },
      keyframes: {
        "lx-select-open": {
          "0%": { transform: "translate3d(0,-10%,0)", opacity: "0" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        "lx-select-closed": {
          "0%": { transform: "translateZ(0)", opacity: "1" },
          "100%": { transform: "translate3d(0,-10%,0)", opacity: "0" },
        },
        "lx-dropdown-open-top": {
          "0%": { transform: "translate3d(0,10%,0)", opacity: "0" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        "lx-dropdown-open-down": {
          "0%": { transform: "translate3d(0,-10%,0)", opacity: "0" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        "lx-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "lx-fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "lx-modal-fade-in-up": {
          "0%": {
            transform: "translateX(-50%) translateY(-50%) translate3d(0,8%,0)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-50%) translateZ(0)",
            opacity: "1",
          },
        },
        "lx-modal-fade-out-down": {
          "0%": {
            transform: "translateX(-50%) translateY(-50%) translateZ(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-50%) translate3d(0,8%,0)",
            opacity: "0",
          },
        },
        "lx-dialog-show-left": {
          "0%": { transform: "translate3d(-100%,0,0)", opacity: "0.8" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        "lx-dialog-hide-left": {
          "0%": { transform: "translateZ(0)", opacity: "1" },
          "100%": { transform: "translate3d(-100%,0,0)", opacity: "0.8" },
        },
        "lx-dialog-show-right": {
          "0%": { transform: "translate3d(100%,0,0)", opacity: "0.8" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        "lx-dialog-hide-right": {
          "0%": { transform: "translateZ(0)", opacity: "1" },
          "100%": { transform: "translate3d(100%,0,0)", opacity: "0.8" },
        },
        "lx-accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "lx-accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "lx-select-open": "lx-select-open 0.2s ease-in-out",
        "lx-select-closed": "lx-select-closed 0.2s ease-in-out",
        "lx-dropdown-open-top": "lx-dropdown-open-top 0.2s ease-in-out",
        "lx-dropdown-open-down": "lx-dropdown-open-down 0.2s ease-in-out",
        "lx-fade-in": "lx-fade-in 0.2s ease-in-out",
        "lx-fade-out": "lx-fade-out 0.2s ease-in-out",
        "lx-modal-fade-in-up": "lx-modal-fade-in-up 0.2s ease-in-out",
        "lx-modal-fade-out-down": "lx-modal-fade-out-down 0.2s ease-in-out",
        "lx-dialog-show-left":
          "lx-dialog-show-left 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        "lx-dialog-hide-left":
          "lx-dialog-hide-left 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        "lx-dialog-show-right":
          "lx-dialog-show-right 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        "lx-dialog-hide-right":
          "lx-dialog-hide-right 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        "lx-accordion-down":
          "lx-accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "lx-accordion-up":
          "lx-accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
};
