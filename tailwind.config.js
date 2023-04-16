/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        sections: "calc(100vw - 17.5rem)",
        baseModal: "32.5rem",
      },
      maxWidth: {
        baseModal: "calc(100vw - 2rem)",
      },
      height: {
        pcMenu: "calc(100vh - 4.5rem)",
        mobileMenu: "calc(100vh - 8rem)",
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
