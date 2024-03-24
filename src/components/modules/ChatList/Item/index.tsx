import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Message } from '@/store/chat'

import { Avatar } from './avatar'
import { Content } from './content'
import { Menus } from './menus'

interface ChatItemProps {
  item: Message
  isLast: boolean
  isLoading: boolean
}

export function ChatItem({ item, isLast, isLoading }: ChatItemProps) {
  return (
    <div className="group">
      <div className="relative pl-12">
        <div className="absolute left-0">
          <Avatar role={item.role} />
        </div>
        <div
          className={cn(
            'w-fit rounded-lg',
            item.role === 'user'
              ? 'bg-[#2c9bfd] text-white'
              : 'bg-gray-100 text-[#272727]',
          )}
        >
          <Content role={item.role} content={item.content} />
          {!!item.attachments?.length && (
            <div className="flex gap-4 px-3 pb-1.5">
              {item.attachments.map((attachment, index) => (
                <div key={index} className="h-16 w-16">
                  <Image
                    className="h-full w-full rounded-md border border-slate-300 object-contain"
                    src={attachment.url}
                    alt="attachment"
                    width={64}
                    height={64}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Menus item={item} isLast={isLast} isLoading={isLoading} />
    </div>
  )
}
