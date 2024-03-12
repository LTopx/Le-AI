import { useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSettingsStore } from '@/store/settings'

export function Avatar() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useSettingsStore((state) => [
    state.avatar,
    state.updateAvatar,
  ])

  const onSave = () => {
    const url = inputRef.current?.value?.trim() || ''

    const regex =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

    if (!url || !regex.test(url)) {
      inputRef.current?.focus()
      return toast.error('Please enter a valid url')
    }

    setValue(url)

    toast.success('Avatar updated successfully.')
  }

  return (
    <Card>
      <CardHeader className="p-[18px]">
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Avatar
        </h4>
        <CardDescription>Customize your avatar</CardDescription>
      </CardHeader>
      <CardContent className="px-[18px] pb-[18px]">
        <div className="grid w-full items-center gap-4">
          <Input ref={inputRef} placeholder="Avatar url" defaultValue={value} />
          <div>
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
