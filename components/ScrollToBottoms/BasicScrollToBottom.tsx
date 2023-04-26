import * as React from "react";
import clsx from "clsx";

import AutoHideFollowButton from "./ScrollToBottom/AutoHideFollowButton";
import Composer from "./ScrollToBottom/Composer";
import Panel from "./ScrollToBottom/Panel";

export interface BasicScrollToBottomProps extends React.PropsWithChildren {
  checkInterval?: number;
  className?: string;
  debounce?: number;
  followButtonClassName?: string;
  initialScrollBehavior?: "auto" | "smooth";
  mode: "bottom" | "top";
  nonce: string;
  scroller?: any;
  scrollViewClassName?: string;
}

const BasicScrollToBottomCore: React.FC<
  Omit<BasicScrollToBottomProps, "mode" | "nonce">
> = ({ children, className, followButtonClassName, scrollViewClassName }) => {
  return (
    <div className={clsx("realative", className)}>
      <Panel className={(scrollViewClassName || "") + ""}>{children}</Panel>
      <AutoHideFollowButton className={(followButtonClassName || "") + ""} />
    </div>
  );
};

const BasicScrollToBottom: React.FC<BasicScrollToBottomProps> = ({
  checkInterval,
  children,
  className,
  debounce,
  followButtonClassName,
  initialScrollBehavior = "smooth",
  mode = "bottom",
  nonce = "",
  scroller,
  scrollViewClassName,
}) => (
  <Composer
    checkInterval={checkInterval}
    debounce={debounce}
    initialScrollBehavior={initialScrollBehavior}
    mode={mode}
    nonce={nonce}
    scroller={scroller}
  >
    <BasicScrollToBottomCore
      className={className}
      followButtonClassName={followButtonClassName}
      scrollViewClassName={scrollViewClassName}
    >
      {children}
    </BasicScrollToBottomCore>
  </Composer>
);

export default BasicScrollToBottom;
