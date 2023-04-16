import React, { useState } from "react";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { useClipboard } from "l-hooks";

interface CopyIconProps {
  className: string | undefined;
  content: any;
}

const CopyIcon: React.FC<CopyIconProps> = ({ className, content }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const { copy } = useClipboard();

  const onCopy = () => {
    if (copySuccess) return;
    copy(content).then(() => {
      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 1800);
    });
  };

  return (
    <div onClick={onCopy} className={className}>
      {copySuccess ? (
        <AiOutlineCheck className="text-[#52c41a]" size={18} />
      ) : (
        <AiOutlineCopy size={18} />
      )}
    </div>
  );
};

export default CopyIcon;
