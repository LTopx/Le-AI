import { useCommonStore } from '@/store/common'

export function Footer() {
  const updateOpen = useCommonStore((state) => state.updateSettingsOpen)

  return (
    <div className="flex h-12 items-center justify-between border-t border-t-zinc-300 px-2.5">
      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#cccdce]">
        <span className="i-mingcute-settings-4-line" />
      </div>
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#cccdce]"
        onClick={() => updateOpen()}
      >
        <span className="i-mingcute-settings-4-line" />
      </div>
    </div>
  )
}
