import { ChatFooter } from '@/components/modules/ChatFooter'
import { ChatList } from '@/components/modules/ChatList'
import { Headers } from '@/components/modules/Headers'
import { SideMenus } from '@/components/modules/SideMenus'

export default function Home() {
  return (
    <div className="fixed inset-0">
      <SideMenus />
      <div className="flex h-full flex-col pl-0 md:pl-[260px]">
        <Headers />
        <ChatList />
        <ChatFooter />
      </div>
    </div>
  )
}
