import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useClipboard } from "l-hooks";
import Icon from "@/components/icon";

interface CodeblockProps {
  language: string;
  value: string;
}

const Codeblock: React.FC<CodeblockProps> = React.memo(
  ({ language, value }) => {
    const { isCopied, copy } = useClipboard();

    const copyToClipboard = () => {
      if (isCopied) return;
      copy(value);
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
              {isCopied ? (
                <Icon icon="check_line" className="text-[#52c41a]" size={18} />
              ) : (
                <Icon icon="copy_2_line" size={18} />
              )}
            </button>
          </div>
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  }
);

Codeblock.displayName = "Codeblock";

export default Codeblock;
