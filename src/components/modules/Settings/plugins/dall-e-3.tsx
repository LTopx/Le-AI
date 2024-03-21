import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  DallE3Quality,
  DallE3Size,
  DallE3Style,
  usePluginsStore,
} from '@/store/plugins'

// - quality
//     - standard（default）
//     - hd
// - size
//     - 1024x1024（default）
//     - 1792x1024
//     - 1024x1792
// - style
//     - vivid（default）
//         - Vivid causes the model to lean towards generating hyper-real and dramatic images
//     - natural
//         - Natural causes the model to produce more natural, less hyper-real looking images

const getPrice = (quality: DallE3Quality, size: DallE3Size) => {
  if (quality === 'standard') {
    if (size === '1024x1024') return 0.04
    if (size === '1792x1024' || size === '1024x1792') return 0.08
  }
  if (quality === 'hd') {
    if (size === '1024x1024') return 0.08
    if (size === '1792x1024' || size === '1024x1792') return 0.12
  }
  return 0
}

export function DallE3() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = usePluginsStore((state) => [
    state.dall_e_3,
    state.updateDallE3,
  ])

  return (
    <Collapsible
      className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger asChild>
        <div className="flex cursor-pointer select-none items-center gap-2 p-[18px]">
          <span
            className={cn(
              'i-mingcute-right-line h-5 w-5 transition-transform',
              { 'rotate-90': open },
            )}
          />
          <h4 className="flex flex-1 scroll-m-20 items-center justify-between gap-2 text-lg font-semibold tracking-tight">
            <div className="flex items-center gap-1">
              <span className="i-logos-openai-icon" />
              <span>DALL·E 3</span>
            </div>
            <div className="ml-2 text-sm">
              ${getPrice(value.quality, value.size)}{' '}
              <span className="text-muted-foreground">/ image</span>
            </div>
          </h4>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-[18px] pb-[18px]">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={value.quality}
                onValueChange={(e) => {
                  setValue({ ...value, quality: e as DallE3Quality })
                }}
              >
                <SelectTrigger id="quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="standard">standard</SelectItem>
                    <SelectItem value="hd">hd</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="size">Size</Label>
              <Select
                value={value.size}
                onValueChange={(e) => {
                  setValue({ ...value, size: e as DallE3Size })
                }}
              >
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1024x1024">1024x1024</SelectItem>
                    <SelectItem value="1792x1024">1792x1024</SelectItem>
                    <SelectItem value="1024x1792">1024x1792</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="style">Style</Label>
              <div className="text-xs text-muted-foreground">
                Vivid causes the model to lean towards generating hyper-real and
                dramatic images. Natural causes the model to produce more
                natural, less hyper-real looking images.
              </div>
              <Select
                value={value.style}
                onValueChange={(e) => {
                  setValue({ ...value, style: e as DallE3Style })
                }}
              >
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="vivid">vivid</SelectItem>
                    <SelectItem value="natural">natural</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
