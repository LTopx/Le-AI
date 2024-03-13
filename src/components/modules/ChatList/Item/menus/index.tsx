import { AlertDialog } from '@/components/common/alertDialog'
import { Copy } from '@/components/common/copy'
import { cn } from '@/lib/utils'
import { Message, useChatStore } from '@/store/chat'

import { EditContent } from './editContent'

export function Menus({
  item,
  isLast,
  isLoading,
}: {
  item: Message
  isLast: boolean
  isLoading: boolean
}) {
  const deleteMessage = useChatStore((state) => state.deleteMessage)
  const regenerateChat = useChatStore((state) => state.regenerateChat)

  return (
    <div
      className={cn(
        'mt-1 flex items-center gap-1 pl-12 text-muted-foreground opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0',
        { 'opacity-100 md:opacity-100': isLast && item.role === 'assistant' },
      )}
    >
      <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#f2f2f2]">
        <Copy className="h-full w-full" text={item.content} />
      </div>
      <EditContent item={item} />
      {item.role === 'user' && !isLoading && (
        <div
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#f2f2f2]"
          onClick={() => regenerateChat(item.id)}
        >
          <span className="i-mingcute-refresh-3-line" />
        </div>
      )}
      <AlertDialog
        trigger={
          <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#f2f2f2]">
            <span className="i-mingcute-delete-2-line" />
          </div>
        }
        title="Delete this message"
        description="This action cannot be undone"
        actionClassName="text-[#f53126]"
        onOk={() => deleteMessage(item.id)}
      />
    </div>
  )
}
