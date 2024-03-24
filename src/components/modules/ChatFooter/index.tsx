'use client'

import { useEffect, useRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import Image from 'next/image'
import { toast } from 'sonner'
import type { KeyboardEvent } from 'react'

import { AlertDialog } from '@/components/common/alertDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { isVisionModel } from '@/lib/model'
import { getPlatform } from '@/lib/platform'
import { cn } from '@/lib/utils'
import { LOADING_STATE, MessageAttachment, useChatStore } from '@/store/chat'

export function ChatFooter() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useChatStore((state) => [
    state.inputValue,
    state.updateInputValue,
  ])
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const [attachments, setAttachments] = useState<MessageAttachment[]>([])

  const activeList = list.find((item) => item.chat_id === activeId)
  const isLoading = activeList?.chat_state !== LOADING_STATE.NONE

  const is_vision = isVisionModel(activeList?.chat_model)

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
    const userLists = activeList?.chat_list.filter(
      (item) => item.role === 'user',
    )
    if (!userLists?.length) return
    regenerateChat(userLists[userLists.length - 1].id)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const platform = getPlatform()

    if (platform === 'mac') {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault()
        onSubmit()
      }
    } else if (platform === 'windows') {
      if ((event.keyCode === 13 || event.keyCode === 10) && !event.shiftKey) {
        event.preventDefault()
        onSubmit()
      }
    }
  }

  const onSubmit = async () => {
    if (isLoading) return
    if (!value?.trim()) return textareaRef.current?.focus()

    setValue('')
    setAttachments([])
    addMessage({
      chat_id: activeId,
      message: value.trim(),
      role: 'user',
      attachments,
    })
    sendChat(activeId)
  }

  useEffect(() => {
    if (window.innerWidth < 768) return

    textareaRef.current?.focus()
  }, [activeId])

  return (
    <div className="border-t py-2">
      <div className="container flex max-w-4xl flex-col gap-1">
        <Textarea
          id="chat-textarea"
          ref={textareaRef}
          className="max-h-56 min-h-min resize-none rounded-xl border-none bg-transparent outline-none transition-all"
          rows={1}
          style={{ boxShadow: 'none' }}
          placeholder={'Enter your message here...'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={onResize}
          onKeyDown={onKeyDown}
        />
        <PhotoProvider>
          <div className="flex gap-4">
            {attachments.map((attachment, index) => (
              <PhotoView key={index} src={attachment.url}>
                <div className="relative h-20 w-20 cursor-pointer">
                  <Image
                    src={attachment.url}
                    alt="img"
                    width={80}
                    height={80}
                    className="h-full w-full rounded-md border object-contain"
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors hover:bg-slate-100"
                  >
                    <span className="i-mingcute-close-line h-[14px] w-[14px]" />
                  </div>
                </div>
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#efefef]">
              <span className="i-mingcute-classify-add-2-line h-[18px] w-[18px]" />
            </div>
            {/* Dealing with base64 image temporarily */}
            {is_vision && (
              <>
                <Label
                  htmlFor="picture"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#efefef]"
                >
                  <span className="i-ri-attachment-2 h-[18px] w-[18px]" />
                </Label>
                <Input
                  id="picture"
                  ref={inputRef}
                  type="file"
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    if (attachments.length >= 3) {
                      return toast.error('Maximum 3 attachments allowed')
                    }
                    const file = e.target.files?.[0]
                    const imgFile = new FileReader()
                    imgFile.readAsDataURL(file!)
                    imgFile.onload = function () {
                      const imgData = this.result
                      setAttachments((prev) => [
                        ...prev,
                        { type: 'image', url: imgData as string },
                      ])
                      inputRef.current!.value = ''
                      textareaRef.current?.focus()
                    }
                  }}
                />
              </>
            )}
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
            {!!activeList?.chat_list?.length && (
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
            )}
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
