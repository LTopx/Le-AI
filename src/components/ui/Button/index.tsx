import * as React from "react";
import clsx from "clsx";

type ButtonType = "default" | "primary" | "danger" | "outline";

type ButtonSize = "xs" | "sm" | "base" | "lg";

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  // Option to fit button width to its parent width
  block?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ButtonSize;
  type?: ButtonType;
}

const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      children,
      block,
      className,
      leftIcon,
      onClick,
      rightIcon,
      size = "sm",
      type = "default",
    },
    forwardedRef
  ) => {
    return (
      <button
        onClick={onClick}
        className={clsx(
          "transition-all duration-100 ease-linear rounded-md font-medium flex items-center justify-center gap-2 tracking-wide",
          { "h-6 text-xs px-2": size === "xs" },
          { "h-8 text-sm px-3": size === "sm" },
          { "h-10 text-base px-4": size === "base" },
          { "h-12 text-lg px-6": size === "lg" },
          { "w-full": block },
          // default
          {
            "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-slate-600/80":
              type === "default",
          },
          {
            "dark:bg-slate-700 dark:hover:bg-slate-600/80 dark:active:bg-slate-600/60 dark:text-white/70":
              type === "default",
          },

          // primary
          {
            "bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white":
              type === "primary",
          },
          {
            "dark:bg-sky-400/90 dark:hover:bg-sky-500/90 dark:active:bg-sky-600/90":
              type === "primary",
          },

          // danger
          {
            "bg-rose-400 hover:bg-red-500 active:bg-rose-600 text-white":
              type === "danger",
          },
          {
            "dark:bg-rose-400/90 dark:hover:bg-rose-500/90 dark:active:bg-rose-600/90":
              type === "danger",
          },

          // outline
          {
            "border border-sky-400 text-sky-400 bg-white/80 backdrop-blur-sm hover:bg-sky-100/80 active:bg-sky-200/60":
              type === "outline",
          },
          {
            "dark:bg-neutral-900/80 dark:border-sky-400/90 dark:text-sky-400/90 dark:hover:bg-sky-50/10 dark:active:bg-sky-50/20":
              type === "outline",
          },
          className
        )}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
