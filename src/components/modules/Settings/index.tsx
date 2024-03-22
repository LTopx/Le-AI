'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { menus, useCommonStore } from '@/store/common'

import { About } from './about'
import { Chat } from './chat'
import { General } from './general'
import { Models } from './models'
import { Plugins } from './plugins'

export function Settings() {
  const [activeMenu, setActiveMenu] = useCommonStore((state) => [
    state.activeSettingsMenu,
    state.updateActiveSettingsMenu,
  ])
  const [open, setOpen] = useCommonStore((state) => [
    state.settingsOpen,
    state.updateSettingsOpen,
  ])

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
        <div className="flex flex-col gap-6 px-6 md:flex-row">
          <Select value={activeMenu} onValueChange={setActiveMenu}>
            <SelectTrigger
              className="w-full md:hidden"
              style={{ boxShadow: 'none' }}
            >
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.value} value={menu.value}>
                  <div className="flex items-center gap-2.5 text-zinc-600">
                    <span className={cn('h-[18px] w-[18px]', menu.icon)} />
                    {menu.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden w-48 flex-col gap-1 md:flex">
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
          <div className="h-[600px] max-h-[calc(100vh-300px)] flex-1 overflow-y-auto">
            {activeMenu === 'general' && <General />}
            {activeMenu === 'chat' && <Chat />}
            {activeMenu === 'models' && <Models />}
            {activeMenu === 'plugins' && <Plugins />}
            {activeMenu === 'about' && <About />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
