import * as React from "react";
import type { ChatItem } from "@/hooks/useChannel";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MemoizedReactMarkdown } from "./reactMarkdown";
import CodeBlock from "./codeblock";

interface Props {
  data: ChatItem;
}

const Content: React.FC<Props> = ({ data }) => {
  if (data.role === "user")
    return <div className="break-all">{data.content}</div>;

  return (
    <MemoizedReactMarkdown
      className="prose !max-w-[85ch] dark:prose-invert"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <CodeBlock
              key={Math.random()}
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black py-1 px-3 dark:border-white">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th className="border border-black bg-gray-500 text-white py-1 px-3 break-words dark:border-white">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-black py-1 px-3 break-words dark:border-white">
              {children}
            </td>
          );
        },
      }}
    >
      {data.content}
    </MemoizedReactMarkdown>
  );
};

export default Content;
