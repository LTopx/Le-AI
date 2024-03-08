'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { LOADING_STATE, Message, useChatStore } from '@/store/chat'

import { ChatItem } from './Item'

export function ChatList() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const scrollRef = useRef<HTMLDivElement>(null)

  const activeChat = list.find((item) => item.chat_id === activeId)

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
    }, 0)
  }, [activeId, list])

  if (!activeChat?.chat_list?.length) return <div className="flex-1" />

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
      <div className="container max-w-4xl px-5">
        <div
          className={cn('flex flex-col gap-7 pb-10 pt-10', {
            'pb-0': activeChat.chat_state !== LOADING_STATE.NONE,
          })}
        >
          {activeChat.chat_list.map((item, index) => (
            <ChatItem
              key={item.id}
              item={item}
              isLast={index === activeChat.chat_list.length - 1}
            />
          ))}
        </div>
        {activeChat.chat_state !== LOADING_STATE.NONE && (
          <div className="mt-4 flex items-center gap-2 pb-10 pl-12 text-muted-foreground">
            <span className="i-mingcute-loading-line h-[18px] w-[18px] animate-spin" />
            <span>
              AI is{' '}
              {activeChat.chat_state === LOADING_STATE.CONNECTING
                ? 'thinking'
                : 'typing'}
              ...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
