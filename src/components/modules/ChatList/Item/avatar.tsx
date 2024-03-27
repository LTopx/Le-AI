import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Model } from '@/components/common/model'
import { Message, useChatStore } from '@/store/chat'
import { useCommonStore } from '@/store/common'
import { useSettingsStore } from '@/store/settings'

export function Avatar({
  role,
  loading,
}: {
  role: Message['role']
  loading: boolean
}) {
  const avatar = useSettingsStore((state) => state.avatar)
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const updateSettingsOpen = useCommonStore((state) => state.updateSettingsOpen)
  const activeList = list.find((item) => item.chat_id === activeId)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    setLoadError(false)
  }, [avatar])

  if (role === 'user') {
    if (avatar && !loadError) {
      return (
        <Image
          className="cursor-pointer rounded-md bg-gray-200"
          src={avatar}
          alt="avatar"
          width={36}
          height={36}
          onError={() => setLoadError(true)}
          onClick={updateSettingsOpen}
        />
      )
    }
    return (
      <div
        className="group/avatar flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-200"
        onClick={updateSettingsOpen}
      >
        <span className="i-mingcute-user-3-fill h-6 w-6 text-gray-500 group-hover/avatar:hidden" />
        <span className="i-mingcute-pic-2-fill hidden h-6 w-6 text-gray-500 group-hover/avatar:block" />
      </div>
    )
  }

  const chat_model = activeList?.chat_model

  return (
    <Model type={chat_model?.type} name={chat_model?.name} loading={loading} />
  )
}
