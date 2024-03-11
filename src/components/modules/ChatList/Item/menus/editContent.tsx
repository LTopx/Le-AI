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
import { Textarea } from '@/components/ui/textarea'
import { Message, useChatStore } from '@/store/chat'

export function EditContent({ item }: { item: Message }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [open, setOpen] = useState(false)

  const updateMessage = useChatStore((state) => state.updateMessage)

  const onSave = () => {
    const content = textareaRef.current?.value?.trim()
    if (!content) {
      textareaRef.current?.focus()
      return toast.error('Cannot be empty')
    }

    updateMessage(item.id, content)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#f2f2f2]">
          <span className="i-mingcute-edit-line" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chat Content</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 gap-2">
          <Textarea ref={textareaRef} defaultValue={item.content} />
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
