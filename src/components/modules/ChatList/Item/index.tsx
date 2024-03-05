import { Message } from '@/store/chat'

import { Avatar } from './avatar'
import { Content } from './content'

interface ChatItemProps {
  item: Message
}

export function ChatItem({ item }: ChatItemProps) {
  return (
    <div className="flex gap-2">
      <Avatar role={item.role} />
      <Content content={item.content} />
    </div>
  )
}
