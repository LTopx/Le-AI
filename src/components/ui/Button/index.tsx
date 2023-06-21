"use client";

import * as React from "react";
import { AiOutlineLoading } from "react-icons/ai";
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
          "border whitespace-nowrap transition-all duration-100 ease-linear rounded-md font-medium flex items-center justify-center gap-2 tracking-wide",
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
          <>
            {loading ? <AiOutlineLoading className="animate-spin" /> : leftIcon}
          </>
        ) : (
          <>{loading ? <AiOutlineLoading className="animate-spin" /> : null}</>
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
