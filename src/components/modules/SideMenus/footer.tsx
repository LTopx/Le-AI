import Link from 'next/link'

import { useCommonStore } from '@/store/common'

export function Footer() {
  const updateOpen = useCommonStore((state) => state.updateSettingsOpen)

  return (
    <div className="flex h-12 items-center justify-between border-t border-t-zinc-300 px-2.5">
      <Link
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#cccdce]"
        href="https://github.com/LTopx/Le-AI"
        target="_blank"
      >
        <span className="i-ri-github-fill" />
      </Link>
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#cccdce]"
        onClick={() => updateOpen()}
      >
        <span className="i-mingcute-settings-4-line" />
      </div>
    </div>
  )
}
