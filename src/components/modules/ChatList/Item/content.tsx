import React from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import { Prism } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { GeistSans } from 'geist/font/sans'
import RehypeKatex from 'rehype-katex'
import RemarkBreaks from 'remark-breaks'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'

import { useCopy } from '@/hooks/useCopy'
import { cn } from '@/lib/utils'
import { Message } from '@/store/chat'

const MemoizedReactMarkdown: React.FC<Options> = React.memo(ReactMarkdown)

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [isCopied, copy] = useCopy()

  return (
    <div
      className={cn('codeblock group/codeblock relative', GeistSans.className)}
    >
      <div className="flex h-9 items-center justify-between border-b border-b-[#ebeaeb] bg-[#fafafa] px-4 text-xs leading-[18px] text-[#666666]">
        <div className="capitalize">{language}</div>
        <div
          className="flex cursor-pointer items-center rounded-sm p-1.5 transition-colors hover:bg-gray-200"
          onClick={() => copy(value)}
        >
          {isCopied ? (
            <span className="i-mingcute-check-line h-4 w-4 !bg-green-400" />
          ) : (
            <span className="i-mingcute-copy-2-line h-4 w-4 !bg-muted-foreground" />
          )}
        </div>
      </div>
      <Prism
        style={oneLight}
        language={language}
        customStyle={{
          background: '#fff',
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {value}
      </Prism>
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
    <MemoizedReactMarkdown
      className={cn(
        'prose w-fit max-w-full rounded-lg px-3 py-1.5 text-base dark:prose-invert',
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
  )
}
