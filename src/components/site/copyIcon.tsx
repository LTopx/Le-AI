"use client";

import React from "react";
import { useClipboard } from "l-hooks";
import { cn } from "@/lib";
import { Icon } from "@/components/ui";
import check_line from "@iconify/icons-mingcute/check-line";
import copy_2_line from "@iconify/icons-mingcute/copy-2-line";

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
    <div
      onClick={onCopy}
      className={cn("flex justify-center items-center", className)}
    >
      {isCopied ? (
        <Icon icon={check_line} className="text-[#52c41a]" size={size} />
      ) : (
        <Icon icon={copy_2_line} className="cursor-pointer" size={size} />
      )}
    </div>
  );
};

export default CopyIcon;
