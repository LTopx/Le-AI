import * as React from "react";
import classNames from "classnames";

interface ButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
  type?: "default" | "primary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "default",
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "h-8 py-1 px-4 transition-all rounded-md border text-sm",
        {
          "bg-white border-[#d9d9d9] shadow-[0_2px_0_rgba(0,0,0,.02)] hover:text-[#4096ff] hover:border-[#4096ff] active:text-[#0958d9] active:border-[#0958d9] focus-visible:outline-4 focus-visible:outline focus-visible:outline-[#91caff]":
            type === "default",
        },
        {
          "bg-[#1677ff] border-[#1677ff] text-white shadow-[0_2px_0_rgba(5,145,255,.1)] hover:bg-[#4096ff] hover:text-white active:text-white active:border-[#0958d9] active:bg-[#0958d9]":
            type === "primary",
        }
      )}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
