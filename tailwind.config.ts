import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@ltopx/lx-ui/dist/presets")],
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@ltopx/lx-ui/dist/**/*.{mjs,js,ts,jsx,tsx,mdx}",
    // single component styles
  ],
  theme: {
    extend: {
      backgroundImage: {
        logo: "linear-gradient(90deg,#41BDF8,#59A5F0,#788ADE,#936DC2,#A34E9D)",
        "share-ico":
          "linear-gradient(to right top,#d16ba5,#c777b9,#ba83ca,#aa8fd8,#9a9ae1,#8aa7ec,#79b3f4,#69bff8,#52cffe,#41dfff,#46eefa,#5ffbf1)",
        "license-free":
          "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
        "license-premium":
          "linear-gradient(to right top, #fac234, #ffbe53, #ffbb6c, #ffbb84, #ffbc99, #ffb99c, #ffb6a0, #ffb4a4, #ffaa9a, #ff9f90, #ff9586, #fe8a7d)",
        "license-team":
          "linear-gradient(to right top, #3bc9b7, #3fccb5, #44ceb3, #49d1b1, #4fd3af, #55d5ad, #5ad7ab, #60d9a9, #66dba6, #6ddea3, #74e0a0, #7be29d)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translate3d(0,2.5rem,0)" },
          "100%": { opacity: "1", transform: "translateZ(0)" },
        },
        showLeft: {
          "0%": { transform: "translate3d(-100%,0,0)", opacity: "0.8" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        hideLeft: {
          "0%": { transform: "translateZ(0)", opacity: "1" },
          "100%": { transform: "translate3d(-100%,0,0)", opacity: "0.8" },
        },
        fadeInUp: {
          "0%": { transform: "translate3d(0,10%,0)", opacity: "0" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        fadeInDown: {
          "0%": { transform: "translate3d(0,-10%,0)", opacity: "0" },
          "100%": { transform: "translateZ(0)", opacity: "1" },
        },
        accordionSlideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionSlideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        flow: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0 50%" },
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
        flow: "flow 6s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};

export default config;
