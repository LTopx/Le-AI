'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { AlertDialog } from '@/components/common/alertDialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LOADING_STATE, useChatStore } from '@/store/chat'

export function ChatFooter() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [value, setValue] = useState('')
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const activeList = list.find((item) => item.chat_id === activeId)
  const isLoading = activeList?.chat_state !== LOADING_STATE.NONE

  const addMessage = useChatStore((state) => state.addMessage)
  const clearMessage = useChatStore((state) => state.clearMessage)
  const sendChat = useChatStore((state) => state.sendChat)
  const stopChat = useChatStore((state) => state.stopChat)
  const regenerateChat = useChatStore((state) => state.regenerateChat)

  const onResize = () => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    textareaRef.current.style.overflow =
      textareaRef.current.getBoundingClientRect().height ===
      textareaRef.current.scrollHeight
        ? 'hidden'
        : 'auto'
  }

  const onRegenerate = () => {
    const assistantLists = activeList?.chat_list.filter(
      (item) => item.role === 'assistant',
    )
    if (!assistantLists?.length) return
    regenerateChat(assistantLists[assistantLists.length - 1].id)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  const onSubmit = async () => {
    if (isLoading) return
    if (!value?.trim()) return textareaRef.current?.focus()

    setValue('')
    addMessage({ chat_id: activeId, message: value.trim(), role: 'user' })
    sendChat(activeId)
  }

  useEffect(() => {
    const keydownHandler = (e: any) => {
      if (e.key === '/') {
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }

    document.addEventListener('keydown', keydownHandler)

    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [])

  useEffect(() => {
    if (window.innerWidth < 768) return

    textareaRef.current?.focus()
  }, [activeId])

  return (
    <div className="border-t py-2">
      <div className="container flex max-w-4xl flex-col gap-1">
        <Textarea
          ref={textareaRef}
          className="max-h-56 min-h-min resize-none rounded-xl border-none bg-transparent outline-none transition-all"
          rows={1}
          style={{ boxShadow: 'none' }}
          placeholder={`Press "/" to focus input`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={onResize}
          onKeyDown={onKeyDown}
        />
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#efefef]">
              <span className="i-mingcute-classify-add-2-line h-[18px] w-[18px]" />
            </div>
            {!!activeList?.chat_list?.length &&
              activeList.chat_state === LOADING_STATE.NONE && (
                <div
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#efefef]"
                  onClick={onRegenerate}
                >
                  <span className="i-mingcute-refresh-3-line h-[18px] w-[18px]" />
                </div>
              )}
            {activeList?.chat_state !== LOADING_STATE.NONE && (
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#efefef]"
                onClick={() => stopChat(activeId)}
              >
                <span className="i-ri-stop-circle-fill h-[18px] w-[18px] text-red-500" />
              </div>
            )}
            <AlertDialog
              trigger={
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#efefef]">
                  <span className="i-mdi-tooltip-remove-outline h-[18px] w-[18px]" />
                </div>
              }
              title="Clear current session messages"
              description="This action cannot be undone"
              actionClassName="text-[#f53126]"
              onOk={() => clearMessage(activeId)}
            />
          </div>

          <div
            onClick={onSubmit}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors md:rounded-xl',
              !!value?.trim()
                ? 'cursor-pointer bg-theme text-white hover:bg-theme/90'
                : 'text-muted-foreground',
            )}
          >
            {isLoading ? (
              <span className="i-mingcute-loading-line h-[18px] w-[18px] animate-spin" />
            ) : (
              <span className="i-ri-send-plane-fill h-[18px] w-[18px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
