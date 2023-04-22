import * as React from "react";
import classNames from "classnames";

type ButtonType = "default" | "primary" | "danger";

type ButtonSize = "xs" | "sm" | "base" | "lg";

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
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
        className={classNames(
          "transition-all duration-100 ease-linear rounded-md font-medium flex items-center justify-center gap-2 tracking-wide",
          { "h-6 text-xs px-2": size === "xs" },
          { "h-8 text-sm px-3": size === "sm" },
          { "h-10 text-base px-4": size === "base" },
          { "h-12 text-lg px-6": size === "lg" },
          { "w-full": block },
          // default
          {
            "bg-slate-300 hover:bg-slate-400/60 active:bg-slate-400/80 text-neutral-600/90":
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
