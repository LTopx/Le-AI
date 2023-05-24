import * as React from "react";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { useClipboard } from "l-hooks";

const CopyIcon: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  content,
}) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const { copy } = useClipboard();

  const onCopy = () => {
    if (copySuccess) return;
    copy(content);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1800);
  };

  return (
    <div onClick={onCopy} className={className}>
      {copySuccess ? (
        <AiOutlineCheck className="text-[#52c41a]" size={18} />
      ) : (
        <AiOutlineCopy className="cursor-pointer" size={18} />
      )}
    </div>
  );
};

export default CopyIcon;
