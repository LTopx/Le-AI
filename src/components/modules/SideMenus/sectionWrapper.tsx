'use client'

import { cn } from '@/lib/utils'
import { useCommonStore } from '@/store/common'

export function SectionWrapper({ children }: { children: React.ReactNode }) {
  const isPCSideMenuOpen = useCommonStore((state) => state.isPCSideMenuOpen)
  const isMSideMenuOpen = useCommonStore((state) => state.isMSideMenuOpen)

  const toggleMSideMenu = useCommonStore((state) => state.toggleMSideMenu)

  return (
    <>
      <div
        className={cn(
          'flex h-full flex-col pl-0 transition-all duration-300 md:pl-[260px]',
          { 'md:pl-0': !isPCSideMenuOpen },
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'fixed inset-0 z-10 block bg-black/50 transition-opacity duration-300 md:hidden',
          { 'pointer-events-none opacity-0': !isMSideMenuOpen },
        )}
        onClick={toggleMSideMenu}
      >
        <div
          className={cn(
            'absolute top-2 flex h-9 w-9 items-center justify-center p-0',
            isMSideMenuOpen ? 'left-[268px]' : 'left-0',
          )}
        >
          <span className="i-mingcute-close-line h-6 w-6 text-white" />
        </div>
      </div>
    </>
  )
}
