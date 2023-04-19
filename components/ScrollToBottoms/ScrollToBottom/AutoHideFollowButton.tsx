import classNames from "classnames";
import * as React from "react";
import { BsChevronDoubleDown } from "react-icons/bs";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";

import useScrollToEnd from "../hooks/useScrollToEnd";
import useSticky from "../hooks/useSticky";
import useStyleToClassName from "../hooks/internal/useStyleToClassName";

const ROOT_STYLE = {
  backgroundColor: "rgba(0, 0, 0, .2)",
  borderRadius: 10,
  borderWidth: 0,
  bottom: 5,
  cursor: "pointer",
  height: 20,
  outline: 0,
  position: "absolute",
  right: 20,
  width: 20,

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, .4)",
  },

  "&:active": {
    backgroundColor: "rgba(0, 0, 0, .6)",
  },
};

const AutoHideFollowButton: React.FC<
  React.PropsWithChildren & { className: string }
> = ({ className }) => {
  const [sticky] = useSticky();
  const rootCSS = (useStyleToClassName as any)()(ROOT_STYLE);
  const scrollToEnd = useScrollToEnd();
  if (sticky) return null;
  return (
    <button
      className={classNames(
        rootCSS,
        "absolute !bottom-20 !w-10 !h-10 !bg-white !rounded-full transition-colors justify-center items-center flex shadow-md",
        "dark:!bg-neutral-800 dark:border dark:border-neutral-600 dark:hover:!bg-neutral-900"
      )}
      onClick={scrollToEnd}
      type="button"
    >
      <HiOutlineChevronDoubleDown />
    </button>
  );
};

export default AutoHideFollowButton;
