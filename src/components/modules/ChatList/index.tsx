'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { scrollToBottom } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import { LOADING_STATE, useChatStore } from '@/store/chat'

import { ChatItem } from './Item'

export function ChatList() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const updateInputValue = useChatStore((state) => state.updateInputValue)

  const activeChat = list.find((item) => item.chat_id === activeId)
  const isLoading = activeChat?.chat_state !== LOADING_STATE.NONE

  useEffect(() => {
    scrollToBottom()
  }, [activeId, list])

  if (!activeChat?.chat_list?.length) return <div className="flex-1" />

  return (
    <div className="auto-scroll-to-bottom flex-1 overflow-y-auto">
      <div className="container max-w-4xl px-5">
        <div
          className={cn('flex flex-col gap-7 pb-10 pt-10', {
            'pb-0': isLoading,
          })}
        >
          {activeChat.chat_list.map((item, index) => (
            <ChatItem
              key={item.id}
              item={item}
              isLast={index === activeChat.chat_list.length - 1}
              isLoading={isLoading}
            />
          ))}
        </div>
        {isLoading && (
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
        {(activeChat.chat_recommendation?.length ||
          activeChat.chat_recommendation_loading) && (
          <div className="mt-2 flex flex-col items-center gap-2 pb-10">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <span className="i-mdi-yelp" />
              Recommended questions
            </div>
            {activeChat.chat_recommendation_loading && (
              <div>
                <span className="i-mingcute-loading-line h-[18px] w-[18px] animate-spin" />
              </div>
            )}

            <div className="grid w-full grid-cols-1 gap-6 px-4 lg:grid-cols-2 xl:grid-cols-3">
              {activeChat.chat_recommendation.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-4 border-l-2 border-l-sky-200 py-1 pl-4 text-sm"
                >
                  <div>
                    {index + 1}. {item}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`https://www.google.com/search?q=${item}`}
                      target="_blank"
                    >
                      <Button
                        className="h-6 gap-1.5 px-2.5 text-xs"
                        variant="outline"
                      >
                        <span className="i-logos-google-icon" />
                        Google Search
                      </Button>
                    </Link>
                    <Button
                      className="h-6 px-2.5 text-xs"
                      variant="outline"
                      onClick={() => {
                        const chatTextarea = document.getElementById(
                          'chat-textarea',
                        ) as HTMLTextAreaElement
                        if (!chatTextarea) return
                        updateInputValue(item)
                        chatTextarea.focus()
                      }}
                    >
                      Continue asking
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
