'use client'

import { useLayoutEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useCommonStore } from '@/store/common'

import { About } from './about'
import { EndPoint } from './endPoint'
import { General } from './general'
import { Models } from './models'

const menus = [
  {
    label: 'General',
    value: 'general',
    icon: 'i-mingcute-settings-4-fill',
  },
  {
    label: 'EndPoint',
    value: 'endPoint',
    icon: 'i-mingcute-cloud-fill',
  },
  {
    label: 'Models',
    value: 'models',
    icon: 'i-mdi-database',
  },
  {
    label: 'About',
    value: 'about',
    icon: 'i-mdi-information',
  },
]

export function Settings() {
  const [activeMenu, setActiveMenu] = useState(menus[0].value)
  const [open, setOpen] = useCommonStore((state) => [
    state.settingsOpen,
    state.updateSettingsOpen,
  ])

  useLayoutEffect(() => {
    if (open) setActiveMenu(menus[0].value)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        center={false}
        className="top-20 w-[1024px] max-w-[calc(100vw-2rem)] translate-y-0 bg-[#f9f9f9] px-0"
      >
        <DialogHeader className="px-6">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex gap-6 px-6">
          <div className="flex w-48 flex-col gap-1">
            {menus.map((menu) => (
              <Button
                key={menu.value}
                variant="ghost"
                size="lg"
                className={cn(
                  'items-center justify-start gap-2.5 px-4 text-zinc-600 hover:bg-neutral-100',
                  {
                    'bg-neutral-200 hover:bg-neutral-200':
                      activeMenu === menu.value,
                  },
                )}
                style={{ boxShadow: 'none' }}
                onClick={() => setActiveMenu(menu.value)}
              >
                <span className={cn('h-[18px] w-[18px]', menu.icon)} />
                {menu.label}
              </Button>
            ))}
          </div>
          <div className="flex-1">
            {activeMenu === 'general' && <General />}
            {activeMenu === 'endPoint' && <EndPoint />}
            {activeMenu === 'models' && <Models />}
            {activeMenu === 'about' && <About />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
