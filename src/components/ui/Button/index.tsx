"use client";

import React from "react";
import { cn } from "@/lib";

type ButtonType = "default" | "primary" | "success" | "danger" | "outline";

type ButtonSize = "xs" | "sm" | "base" | "lg";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  // Option to fit button width to its parent width
  disabled?: boolean;
  block?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ButtonSize;
  type?: ButtonType;
  loading?: boolean;
}

const LoadingLine = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient
        id="mingcuteLoadingLine0"
        x1="50%"
        x2="50%"
        y1="5.271%"
        y2="91.793%"
      >
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity=".55" />
      </linearGradient>
      <linearGradient
        id="mingcuteLoadingLine1"
        x1="50%"
        x2="50%"
        y1="8.877%"
        y2="90.415%"
      >
        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
        <stop offset="100%" stopColor="currentColor" stopOpacity=".55" />
      </linearGradient>
    </defs>
    <g fill="none">
      <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <path
        fill="url(#mingcuteLoadingLine0)"
        d="M8.886.006a1 1 0 0 1 .22 1.988A8.001 8.001 0 0 0 10 17.944v2c-5.523 0-10-4.476-10-10C0 4.838 3.848.566 8.886.007Z"
        transform="translate(2 2.055)"
      />
      <path
        fill="url(#mingcuteLoadingLine1)"
        d="M14.322 1.985a1 1 0 0 1 1.392-.248A9.988 9.988 0 0 1 20 9.945c0 5.523-4.477 10-10 10v-2a8 8 0 0 0 4.57-14.567a1 1 0 0 1-.248-1.393Z"
        transform="translate(2 2.055)"
      />
    </g>
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled,
      block,
      className,
      leftIcon,
      onClick,
      rightIcon,
      size = "sm",
      type = "default",
      loading,
    },
    forwardedRef
  ) => {
    const onBtnClick = (
      e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
    ) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      (
        onClick as React.MouseEventHandler<
          HTMLButtonElement | HTMLAnchorElement
        >
      )?.(e);
    };

    return (
      <button
        ref={forwardedRef}
        onClick={onBtnClick}
        className={cn(
          "border whitespace-nowrap transition-all duration-100 ease-linear rounded-md font-medium flex items-center justify-center gap-1.5 tracking-wide",
          { "h-6 text-xs px-2": size === "xs" },
          { "h-8 text-sm px-3": size === "sm" },
          { "h-10 text-base px-4": size === "base" },
          { "h-12 text-lg px-6": size === "lg" },
          { "w-full": block },
          // default
          {
            "border-gray-100 bg-gray-100 hover:border-gray-200 hover:bg-gray-200 active:border-gray-300 active:bg-gray-300 text-slate-600/80":
              type === "default",
          },
          {
            "dark:border-slate-700 dark:bg-slate-700 dark:hover:border-slate-600/80 dark:hover:bg-slate-600/80 dark:active:border-slate-600/60 dark:active:bg-slate-600/60 dark:text-white/70":
              type === "default",
          },

          // primary
          {
            "border-sky-400 bg-sky-400 hover:border-sky-500 hover:bg-sky-500 active:border-sky-600 active:bg-sky-600 text-white":
              type === "primary",
          },
          {
            "border-sky-400/80 bg-sky-400/80 hover:border-sky-400/80 hover:bg-sky-400/80 active:border-sky-400/80 active:bg-sky-400/80":
              type === "primary" && loading,
          },
          {
            "dark:border-sky-400/90 dark:bg-sky-400/90 dark:hover:border-sky-500/90 dark:hover:bg-sky-500/90 dark:active:border-sky-600/90 dark:active:bg-sky-600/90":
              type === "primary",
          },
          {
            "border-sky-500/10 bg-sky-500/50 dark:border-sky-500/10 dark:bg-sky-500/50 hover:border-sky-500/10 hover:bg-sky-500/50 dark:hover:border-sky-500/10 dark:hover:bg-sky-500/50 active:border-sky-500/10 active:bg-sky-500/50 dark:active:border-sky-500/10 dark:active:bg-sky-500/50 cursor-not-allowed":
              type === "primary" && disabled,
          },

          // danger
          {
            "border-rose-400 bg-rose-400 hover:border-red-500 hover:bg-red-500 active:border-rose-600 active:bg-rose-600 text-white":
              type === "danger",
          },
          {
            "dark:border-rose-400/90 dark:bg-rose-400/90 dark:hover:border-rose-500/90 dark:hover:bg-rose-500/90 dark:active:border-rose-600/90 dark:active:bg-rose-600/90":
              type === "danger",
          },

          // success
          {
            "border-green-400 bg-green-400 hover:border-green-500 hover:bg-green-500 active:border-green-600 active:bg-green-600 text-white":
              type === "success",
          },
          {
            "dark:border-green-400/90 dark:bg-green-400/90 dark:hover:border-green-500/90 dark:hover:bg-green-500/90 dark:active:border-green-600/90 dark:active:bg-green-600/90":
              type === "success",
          },

          // outline
          {
            "border-sky-400 text-sky-400 bg-white/80 backdrop-blur-sm hover:bg-sky-100/80 active:bg-sky-200/60":
              type === "outline",
          },
          {
            "dark:bg-neutral-900/80 dark:border-sky-400/90 dark:text-sky-400/90 dark:hover:bg-sky-50/10 dark:active:bg-sky-50/20":
              type === "outline",
          },
          { "cursor-not-allowed": loading },
          className
        )}
      >
        {leftIcon ? (
          <>{loading ? <LoadingLine className="animate-spin" /> : leftIcon}</>
        ) : (
          <>{loading ? <LoadingLine className="animate-spin" /> : null}</>
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
