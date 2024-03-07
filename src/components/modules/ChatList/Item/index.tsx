import { Message } from '@/store/chat'

import { Avatar } from './avatar'
import { Content } from './content'
import { Menus } from './menus'

interface ChatItemProps {
  item: Message
  isLast: boolean
}

export function ChatItem({ item, isLast }: ChatItemProps) {
  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar role={item.role} />
        <Content role={item.role} content={item.content} />
      </div>
      <Menus isLast={isLast} item={item} />
    </div>
  )
}
