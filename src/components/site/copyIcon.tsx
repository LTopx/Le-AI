"use client";

import * as React from "react";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { useClipboard } from "l-hooks";

interface CopyIconProps extends React.HTMLAttributes<HTMLElement> {
  size?: number;
}

const CopyIcon: React.FC<CopyIconProps> = ({
  className,
  content,
  size = 18,
}) => {
  const { isCopied, copy } = useClipboard();

  const onCopy = () => {
    if (isCopied) return;
    copy(content);
  };

  return (
    <div onClick={onCopy} className={className}>
      {isCopied ? (
        <AiOutlineCheck className="text-[#52c41a]" size={size} />
      ) : (
        <AiOutlineCopy className="cursor-pointer" size={size} />
      )}
    </div>
  );
};

export default CopyIcon;
