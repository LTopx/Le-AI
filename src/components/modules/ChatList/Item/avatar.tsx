import { Model } from '@/components/common/model'
import { Message, useChatStore } from '@/store/chat'

export function Avatar({ role }: { role: Message['role'] }) {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const activeList = list.find((item) => item.chat_id === activeId)

  if (role === 'user') {
    return (
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gray-200">
        <span className="i-mingcute-user-3-fill h-6 w-6 text-gray-500" />
      </div>
    )
  }

  const chat_model = activeList?.chat_model

  return <Model type={chat_model?.type} name={chat_model?.name} />
}
