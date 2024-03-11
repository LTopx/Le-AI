'use client'

import { useEffect } from 'react'

import { AlertDialog } from '@/components/common/alertDialog'
import { Logo } from '@/components/modules/Logo'
import { cn } from '@/lib/utils'
import { LOADING_STATE, useChatStore } from '@/store/chat'
import { useCommonStore } from '@/store/common'

import { EditChatName } from './editChatName'
import { Footer } from './footer'

export function SideMenus() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const isPCSideMenuOpen = useCommonStore((state) => state.isPCSideMenuOpen)
  const isMSideMenuOpen = useCommonStore((state) => state.isMSideMenuOpen)
  const toggleMSideMenu = useCommonStore((state) => state.toggleMSideMenu)

  const switchChat = useChatStore((state) => state.switchChat)
  const addChat = useChatStore((state) => state.addChat)
  const deleteChat = useChatStore((state) => state.deleteChat)
  const clearChat = useChatStore((state) => state.clearChat)

  useEffect(() => {
    if (isMSideMenuOpen) toggleMSideMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  return (
    <div
      className={cn(
        'absolute bottom-0 top-0 z-20 flex w-[260px] flex-col bg-[#e1e3e3] transition-all duration-300',
        isPCSideMenuOpen ? 'md:translate-x-0' : 'md:-translate-x-full',
        isMSideMenuOpen ? '' : '-translate-x-full',
      )}
    >
      <div className="flex h-12 items-center px-2.5">
        <Logo />
      </div>
      <div className="flex gap-1.5 px-2.5">
        <div
          onClick={addChat}
          className="flex h-9 flex-1 cursor-pointer select-none items-center justify-center gap-2 rounded-lg bg-[#cccdce]/80 text-sm transition-colors hover:bg-[#cccdce]/60"
        >
          <span className="i-mingcute-chat-2-fill h-4 w-4" />
          New Chat
        </div>
        <AlertDialog
          trigger={
            <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#cccdce]/80 transition-colors hover:bg-[#cccdce]/60">
              <span className="i-f7-trash" />
            </div>
          }
          title="Are you sure?"
          description="Are you sure you want to clear all chat?"
          actionClassName="text-[#f53126]"
          onOk={clearChat}
        />
      </div>
      <div className="my-2 flex flex-1 flex-col gap-1 overflow-y-auto px-2.5">
        {list.map((item) => (
          <div
            key={item.chat_id}
            className={cn(
              'group flex h-10 flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2 transition-colors hover:bg-[#cccdce]',
              { 'bg-[#cccdce]': activeId === item.chat_id },
            )}
            onClick={() => switchChat(item.chat_id)}
          >
            <span
              className={cn(
                'text-[#4b4b4b]',
                item.chat_state !== LOADING_STATE.NONE
                  ? 'i-mingcute-loading-line animate-spin'
                  : 'i-mingcute-message-3-line',
              )}
            />
            <div className=" flex-1 select-none truncate whitespace-nowrap text-sm text-[#4b4b4b]">
              {item.chat_name || 'Untitled'}
            </div>
            <div className="hidden gap-1.5 group-hover:flex">
              <EditChatName />
              <AlertDialog
                trigger={<span className="i-f7-trash h-[15.5px] w-[15.5px]" />}
                title="Are you sure?"
                description="Are you sure you want to delete the chat?"
                actionClassName="text-[#f53126]"
                onOk={() => deleteChat(item.chat_id)}
              />
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}
