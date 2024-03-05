'use client'

import { useEffect, useRef } from 'react'

import { LOADING_STATE, Message, useChatStore } from '@/store/chat'

import { ChatItem } from './Item'

export function ChatList() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const scrollRef = useRef<HTMLDivElement>(null)

  // // const activeChat = list.find((item) => item.chat_id === activeId)

  // // console.log(activeId, 'activeId')
  // // console.log(list, 'list')
  // const activeChat = useMemo(() => {
  //   return list.find((item) => item.chat_id === activeId)
  // }, [activeId, list])

  // console.log(activeChat?.chat_list, 'activeChat')
  const activeChat = list.find((item) => item.chat_id === activeId)

  useEffect(() => {
    // const findChat = list.find((item) => item.chat_id === activeId)
    // setMessages(findChat?.chat_list || [])

    setTimeout(() => {
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
    }, 0)
  }, [activeId, list])

  if (!activeChat?.chat_list?.length) return <div className="flex-1" />

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
      <div className="container max-w-4xl">
        <div className="flex flex-col gap-6 py-10">
          {activeChat.chat_list.map((item) => (
            <ChatItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
