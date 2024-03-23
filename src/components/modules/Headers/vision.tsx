'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MODEL_LIST } from '@/constants/models'
import { useChatStore } from '@/store/chat'

export function Vision() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const activeList = list.find((item) => item.chat_id === activeId)

  const model_vision = MODEL_LIST.find(
    (val) => val.model_provider === activeList?.chat_model.type,
  )?.model_list.find(
    (item) => item.model_value === activeList?.chat_model.name,
  )?.model_vision

  if (!model_vision) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="i-mingcute-eye-2-fill h-6 w-6 text-[#ef424f]" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Vision</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
