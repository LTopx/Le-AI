import * as React from "react";
import classNames from "classnames";

interface ButtonProps extends React.PropsWithChildren {
  onClick?: (...args: any) => void;
  type?: "default" | "primary" | "danger";
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ children, onClick, type = "default" }, forwardedRef) => {
    return (
      <button
        onClick={onClick}
        className={classNames(
          "h-8 py-1 px-4 transition-all rounded-md border text-sm",
          // default
          {
            "bg-[#f2f3f5] hover:bg-[#e5e6eb] active:bg-[#c9cdd4] border-transparent text-gray-8":
              type === "default",
          },
          {
            "dark:bg-[#3a3a3b] dark:hover:bg-[#414141] dark:active:bg-[#484848] dark:text-color-text-2":
              type === "default",
          },

          // primary
          {
            "bg-[#295cff] hover:bg-[#4080ff] active:bg-[#1f42d2] text-white border-transparent":
              type === "primary",
          },
          {
            "dark:bg-[#3c7eff] dark:hover:bg-[#306fff] dark:active:bg-[#689fff]":
              type === "primary",
          },

          // danger
          {
            "bg-[#f53f3f] hover:bg-[#f66560] active:bg-[#cb272e] text-white border-transparent":
              type === "danger",
          },
          {
            "dark:bg-[#f66966] dark:hover:bg-[#f54e4e] dark:active:bg-[#f78d86]":
              type === "danger",
          }
        )}
      >
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
