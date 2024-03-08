'use client'

import { Button } from '@/components/ui/button'
import { useCommonStore } from '@/store/common'

export function ToggleMenu() {
  const togglePCSideMenu = useCommonStore((state) => state.togglePCSideMenu)
  const toggleMSideMenu = useCommonStore((state) => state.toggleMSideMenu)

  return (
    <>
      <Button
        className="hidden h-auto px-2 py-1 md:flex"
        variant="ghost"
        onClick={togglePCSideMenu}
      >
        <span className="i-f7-sidebar-left h-[18px] w-[18px] text-muted-foreground" />
      </Button>
      <Button
        className="h-auto px-2 py-1 md:hidden"
        variant="ghost"
        onClick={toggleMSideMenu}
      >
        <span className="i-f7-sidebar-left h-[18px] w-[18px] text-muted-foreground" />
      </Button>
    </>
  )
}
