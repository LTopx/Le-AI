import React from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import RehypeKatex from 'rehype-katex'
import RemarkBreaks from 'remark-breaks'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { Message } from '@/store/chat'

const MemoizedReactMarkdown: React.FC<Options> = React.memo(ReactMarkdown)

function CodeBlock({ language, value }: { language: string; value: string }) {
  return (
    <div className="codeblock group/codeblock relative">
      <div className="bg-[#2d3c47] px-4 py-2 text-xs leading-[18px]">
        <div className="capitalize">{language}</div>
      </div>
      {/* <CopyToClipboard content={value} /> */}
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

export function Content({
  content,
  role,
}: {
  content: string
  role: Message['role']
}) {
  return (
    <div className="flex items-center">
      <MemoizedReactMarkdown
        className={cn(
          'prose rounded-lg px-3 py-1.5 text-base dark:prose-invert',
          role === 'user'
            ? 'bg-[#2c9bfd] text-white'
            : 'bg-gray-100 text-[#272727]',
        )}
        remarkPlugins={[RemarkGfm, RemarkMath, RemarkBreaks]}
        rehypePlugins={[RehypeKatex]}
        components={{
          code(props) {
            const { children, className, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <CodeBlock
                value={String(children).replace(/\n$/, '')}
                language={match[1]}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          },
          table({ children }) {
            return (
              <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                {children}
              </table>
            )
          },
          th({ children }) {
            return (
              <th
                className={cn(
                  'break-words border border-black bg-gray-500 px-3 py-1 text-white',
                  'dark:border-white/70 dark:bg-gray-700',
                )}
              >
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="break-words border border-black px-3 py-1 dark:border-white/70">
                {children}
              </td>
            )
          },
        }}
      >
        {content}
      </MemoizedReactMarkdown>
    </div>
  )
}
