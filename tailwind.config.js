/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        "color-border": "#333335",
        "color-fill-3": "hsla(0,0%,100%,0.12)",
      },
      width: {
        section: "calc(100vw - 17.5rem)",
        baseModal: "32.5rem",
        "confirm-modal": "28rem",
      },
      maxWidth: {
        baseModal: "calc(100vw - 2rem)",
        "confirm-modal": "calc(100vw - 2rem)",
      },
      height: {
        pcMenu: "calc(100vh - 11rem)",
        mobileMenu: "calc(100vh - 14rem)",
      },
      backgroundColor: {
        "color-fill-1": "hsla(0,0%,100%,0.04)",
        "color-fill-2": "hsla(0,0%,100%,0.08)",
        "color-fill-3": "hsla(0,0%,100%,0.12)",
        "color-bg-2": "#232324",
        "color-bg-5": "#373739",
        "gray-2": "rgb(242,243,245)",

        // mask,confirm,drawer
        mask: "rgba(23,23,26,0.6)",
      },
      backgroundSize: {
        "magic-size": "200% 100%",
      },
      backgroundPosition: {
        "magic-position": "100% 0",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#678fff",
        disabled: "rgba(0,0,0,.25)",
        "menu-active": "#e6f0ff",
        "menu-hover": "#edeeee",
        "base-color": "rgba(0,0,0,0.85)",
        icon: "rgba(0, 0, 0, 0.45)",
        "icon-hover": "rgba(0, 0, 0, 0.88)",
        "color-text-1": "hsla(0,0%,100%,0.9)",
        "color-text-2": "hsla(0,0%,100%,0.7)",
        "gray-8": "rgb(78,89,105)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translate3d(0,2.5rem,0)" },
          "100%": { opacity: 1, transform: "translateZ(0)" },
        },
        fadeDown: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, transform: "translate3d(0,2rem,0)" },
        },
        showLeft: {
          "0%": { transform: "translate3d(-100%,0,0)" },
          "100%": { transform: "translateZ(0)" },
        },
        hideLeft: {
          "0%": { transform: "translateZ(0)" },
          "100%": { transform: "translate3d(-100%,0,0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        fadeOut: "fadeOut 0.2s ease-in-out",
        fadeUp: "fadeUp 0.2s cubic-bezier(.08,.82,.17,1)",
        showLeft: "showLeft 0.2s ease-in-out",
        hideLeft: "hideLeft 0.2s ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
