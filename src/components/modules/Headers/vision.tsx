'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { isVisionModel } from '@/lib/model'
import { useChatStore } from '@/store/chat'

export function Vision() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])

  const activeList = list.find((item) => item.chat_id === activeId)

  const is_vision = isVisionModel(activeList?.chat_model)

  if (!is_vision) return null

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
