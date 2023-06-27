import * as React from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { BsFillPlayFill, BsStopFill } from "react-icons/bs";
import type { LicenseType, ChatItem } from "@/hooks";
import { cn } from "@/lib";
import { Button, Divider, Link } from "@/components/ui";
import { MemoizedReactMarkdown } from "./reactMarkdown";
import CodeBlock from "./codeblock";

interface Props {
  data: ChatItem;
  license_type: LicenseType;
  onRead: () => void;
  onPause: () => void;
  onTTSSetting: () => void;
}

const Content: React.FC<Props> = ({
  data,
  license_type,
  onRead,
  onPause,
  onTTSSetting,
}) => {
  return (
    <>
      <MemoizedReactMarkdown
        className="prose !max-w-[85ch] dark:prose-invert"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
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
              <th
                className={cn(
                  "border border-black bg-gray-500 text-white py-1 px-3 break-words",
                  "dark:bg-gray-700 dark:border-white/70"
                )}
              >
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-black py-1 px-3 break-words dark:border-white/70">
                {children}
              </td>
            );
          },
        }}
      >
        {data.content}
      </MemoizedReactMarkdown>
      {data.role === "assistant" &&
        (license_type === "premium" || license_type === "team") && (
          <>
            <Divider className="border-b-neutral-400/20 dark:border-b-neutral-200/20 my-2" />
            <div className="flex gap-2 items-center">
              <Button
                type="outline"
                size="xs"
                leftIcon={<BsFillPlayFill size={18} />}
                loading={data.tts_loading}
                onClick={onRead}
              />
              {data.tts_loading && (
                <Button size="xs" type="primary" onClick={onPause}>
                  <BsStopFill size={18} />
                </Button>
              )}
              <Link
                className="md:hidden group-hover/item:block text-sm"
                onClick={onTTSSetting}
              >
                Setting
              </Link>
            </div>
          </>
        )}
    </>
  );
};

export default Content;
