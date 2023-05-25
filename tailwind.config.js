/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        showLeft: {
          "0%": { transform: "translate3d(-100%,0,0)", opacity: 0.8 },
          "100%": { transform: "translateZ(0)", opacity: 1 },
        },
        hideLeft: {
          "0%": { transform: "translateZ(0)", opacity: 1 },
          "100%": { transform: "translate3d(-100%,0,0)", opacity: 0.8 },
        },
        fadeInUp: {
          "0%": { transform: "translate3d(0,10%,0)", opacity: 0 },
          "100%": { transform: "translateZ(0)", opacity: 1 },
        },
        fadeInDown: {
          "0%": { transform: "translate3d(0,-10%,0)", opacity: 0 },
          "100%": { transform: "translateZ(0)", opacity: 1 },
        },
        accordionSlideDown: {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionSlideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        fadeOut: "fadeOut 0.2s ease-in-out",
        fadeUp: "fadeUp 0.2s cubic-bezier(.08,.82,.17,1)",
        showLeft: "showLeft 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        hideLeft: "hideLeft 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        fadeInUp: "fadeInUp 0.2s ease-in-out",
        fadeInDown: "fadeInDown 0.2s ease-in-out",
        accordionSlideDown:
          "accordionSlideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        accordionSlideUp:
          "accordionSlideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
