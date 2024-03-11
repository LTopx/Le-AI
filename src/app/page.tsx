import { ChatFooter } from '@/components/modules/ChatFooter'
import { ChatList } from '@/components/modules/ChatList'
import { Headers } from '@/components/modules/Headers'
import { Settings } from '@/components/modules/Settings'
import { SideMenus } from '@/components/modules/SideMenus'
import { SectionWrapper } from '@/components/modules/SideMenus/sectionWrapper'

export default function Home() {
  return (
    <>
      <div className="fixed inset-0">
        <SideMenus />
        <SectionWrapper>
          <Headers />
          <ChatList />
          <ChatFooter />
        </SectionWrapper>
      </div>
      <Settings />
    </>
  )
}
