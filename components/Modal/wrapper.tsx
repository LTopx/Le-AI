import * as React from "react";
import { createPortal } from "react-dom";
import Modal from "./modal";
import type { IModalPropTypes } from "./types";

const ModalWrapper: React.FC<IModalPropTypes> = (props) => {
  const { open, children } = props;

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

  return createPortal(<Modal {...props}>{children}</Modal>, document.body);
};

export default ModalWrapper;
