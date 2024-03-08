'use client'

import { useMemo } from 'react'

import { Model } from '@/components/common/model'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MODEL_LISTS, ModelProvider } from '@/constants/models'
import { useChatStore } from '@/store/chat'

export function ModelSelect() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const updateChat = useChatStore((state) => state.updateChat)

  const activeChat = list.find((item) => item.chat_id === activeId)

  const { provider, model, name } = useMemo(() => {
    const model = activeChat?.chat_model.name
    const findProvider = MODEL_LISTS.find((val) => {
      return val.model_list.find((item) => item.model_value === model)
    })
    if (!findProvider) return { provider: '', model: '' }
    const findModel = findProvider.model_list.find(
      (item) => item.model_value === model,
    )

    return {
      provider: findProvider?.model_provider,
      model,
      name: findModel?.model_name,
    }
  }, [activeChat?.chat_model.name])

  const onModelChange = (value: string) => {
    const findProvider = MODEL_LISTS.find((val) => {
      return val.model_list.find((item) => item.model_value === value)
    })
    if (!findProvider) return

    updateChat(activeId, {
      chat_model: { type: findProvider.model_provider, name: value },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-[34px] gap-1.5 pl-3 pr-2"
          style={{ boxShadow: 'none' }}
        >
          <Model
            className="mr-1 rounded-md"
            type={provider as ModelProvider}
            name={model}
            size={7}
            iconSize={5}
          />
          <span>{name}</span>
          <span className="i-mingcute-down-fill h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" sideOffset={3}>
        <DropdownMenuLabel>Models</DropdownMenuLabel>
        <div className="max-h-96 overflow-y-auto overflow-x-hidden">
          {MODEL_LISTS.map((models) => (
            <div key={models.model_provider}>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={model}
                onValueChange={onModelChange}
              >
                {models.model_list.map((model) => (
                  <DropdownMenuRadioItem
                    key={model.model_value}
                    value={model.model_value}
                    className="gap-2"
                  >
                    <Model
                      className="rounded"
                      type={models.model_provider}
                      name={model.model_value}
                      size={6}
                      iconSize={4.5}
                    />
                    {model.model_name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
