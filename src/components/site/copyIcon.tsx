"use client";

import * as React from "react";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { useClipboard } from "l-hooks";

const CopyIcon: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  content,
}) => {
  const { isCopied, copy } = useClipboard();

  const onCopy = () => {
    if (isCopied) return;
    copy(content);
  };

  return (
    <div onClick={onCopy} className={className}>
      {isCopied ? (
        <AiOutlineCheck className="text-[#52c41a]" size={18} />
      ) : (
        <AiOutlineCopy className="cursor-pointer" size={18} />
      )}
    </div>
  );
};

export default CopyIcon;
