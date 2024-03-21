'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { MODEL_LIST, MODEL_PLUGINS } from '@/constants/models'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import { useCommonStore } from '@/store/common'

export function PluginSelect() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const activeChat = list.find((item) => item.chat_id === activeId)

  const updateChat = useChatStore((state) => state.updateChat)
  const updateSettingsOpen = useCommonStore((state) => state.updateSettingsOpen)
  const updateActiveSettingsMenu = useCommonStore(
    (state) => state.updateActiveSettingsMenu,
  )

  const findModelProvider = MODEL_LIST.find((val) => {
    return val.model_list.find(
      (item) => item.model_value === activeChat?.chat_model.name,
    )
  })

  if (!findModelProvider) return null
  const findModel = findModelProvider.model_list.find(
    (item) => item.model_value === activeChat?.chat_model.name,
  )

  if (!findModel?.model_plugin) return null

  const chat_plugins = activeChat?.chat_plugins ?? []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative h-[34px] px-2"
          variant="ghost"
          style={{ boxShadow: 'none' }}
        >
          <span className="i-mingcute-plugin-2-fill h-6 w-6 text-sky-400" />
          <div
            className={cn(
              'absolute right-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-xs transition-colors',
              chat_plugins.length
                ? 'bg-green-400 text-white'
                : 'bg-green-300 text-white',
            )}
          >
            {chat_plugins.length}
          </div>
          <span className="i-mingcute-down-fill ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" sideOffset={3}>
        <DropdownMenuLabel>Plugins</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {MODEL_PLUGINS.map((plugin) => (
            <DropdownMenuItem
              className="items-center justify-between"
              key={plugin.value}
            >
              <div className="flex items-center">
                <div className="mr-2 flex items-center">{plugin.icon}</div>
                <span>{plugin.label}</span>
              </div>
              <div
                className="flex items-center"
                onClick={(e) => e.preventDefault()}
              >
                <Switch
                  checked={chat_plugins.includes(plugin.value)}
                  onCheckedChange={(e) => {
                    if (e) {
                      updateChat(activeId, {
                        chat_plugins: [...chat_plugins, plugin.value],
                      })
                    } else {
                      updateChat(activeId, {
                        chat_plugins: chat_plugins.filter(
                          (item) => item !== plugin.value,
                        ),
                      })
                    }
                  }}
                />
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            updateActiveSettingsMenu('plugins')
            updateSettingsOpen()
          }}
        >
          <span className="i-icon-park-solid-more-app mr-2 h-5 w-5" />
          <span>Plugins Setting</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
