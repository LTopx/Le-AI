import React from "react";
import { useClipboard } from "l-hooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";

interface Props {
  language: string;
  value: string;
}

const CodeBlock: React.FC<Props> = React.memo(({ language, value }) => {
  const { copy } = useClipboard();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    if (copied) return;
    copy(value).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="font-sans text-base codeblock relative">
      <div className="flex items-center justify-between py-1.5 px-4">
        <div className="text-sm lowercase text-white">{language}</div>
        <div className="flex items-center">
          <button
            className="flex gap-0.5 items-center rounded bg-none p-1 text-xs text-white"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <AiOutlineCheck className="text-[#52c41a]" size={18} /> Copied!
              </>
            ) : (
              <>
                <AiOutlineCopy size={18} /> Copy code
              </>
            )}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
