import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/store/chat'

export function EditChatName() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const updateChat = useChatStore((state) => state.updateChat)

  const activeList = list.find((item) => item.chat_id === activeId)

  const onSave = () => {
    if (!inputRef.current?.value?.trim()) {
      inputRef.current?.focus()
      return toast.error('Cannot be empty')
    }
    updateChat(activeId, { chat_name: inputRef.current.value.trim() })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <span className="i-ri-edit-line" />
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Chat Name</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 gap-2">
          <Input ref={inputRef} defaultValue={activeList?.chat_name} />
        </div>
        <DialogFooter>
          <div className="flex flex-1 justify-between">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={onSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
