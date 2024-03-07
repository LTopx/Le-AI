'use client'

import { useEffect, useRef } from 'react'

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
      <div className="container max-w-4xl">
        <div className="flex flex-col gap-7 py-10">
          {activeChat.chat_list.map((item, index) => (
            <ChatItem
              key={item.id}
              item={item}
              isLast={index === activeChat.chat_list.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
