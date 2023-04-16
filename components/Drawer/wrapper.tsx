import * as React from "react";
import { createPortal } from "react-dom";
import Drawer from "./drawer";
import type { IDrawerPropTypes } from "./types";

const DrawerWrapper: React.FC<IDrawerPropTypes> = (props) => {
  const { children, open } = props;

  const [animationVisible, setAnimationVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setAnimationVisible(true);
    } else {
      setTimeout(() => {
        setAnimationVisible(false);
      }, 190);
    }
  }, [open]);

  if (!animationVisible) return null;

  return createPortal(<Drawer {...props}>{children}</Drawer>, document.body);
};

export default DrawerWrapper;
