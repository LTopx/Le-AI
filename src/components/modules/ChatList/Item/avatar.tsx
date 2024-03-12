import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Model } from '@/components/common/model'
import { Message, useChatStore } from '@/store/chat'
import { useSettingsStore } from '@/store/settings'

export function Avatar({ role }: { role: Message['role'] }) {
  const avatar = useSettingsStore((state) => state.avatar)
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const activeList = list.find((item) => item.chat_id === activeId)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    setLoadError(false)
  }, [avatar])

  if (role === 'user') {
    if (avatar && !loadError) {
      return (
        <Image
          className="rounded-md bg-gray-200"
          src={avatar}
          alt="avatar"
          width={36}
          height={36}
          onError={() => setLoadError(true)}
        />
      )
    }
    return (
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gray-200">
        <span className="i-mingcute-user-3-fill h-6 w-6 text-gray-500" />
      </div>
    )
  }

  const chat_model = activeList?.chat_model

  return <Model type={chat_model?.type} name={chat_model?.name} />
}
