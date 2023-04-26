import clsx from "clsx";
import React, { useContext } from "react";

import InternalContext from "./InternalContext";
import useStyleToClassName from "../hooks/internal/useStyleToClassName";

const ROOT_STYLE = {
  height: "100%",
  overflowY: "auto",
  width: "100%",
};

export interface PanelProps extends React.PropsWithChildren {
  className: string;
}

const Panel: React.FC<PanelProps> = ({ children, className }) => {
  const { setTarget } = useContext(InternalContext);
  const rootCSS = useStyleToClassName()(ROOT_STYLE);

  return (
    <div className={clsx(rootCSS, (className || "") + "")} ref={setTarget}>
      {children}
    </div>
  );
};

export default Panel;
