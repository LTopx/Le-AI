import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

export function useCopy() {
  const [isCopied, setCopied] = useState(false)
  const [, copyToClipboard] = useCopyToClipboard()

  const copy = (text: string) => {
    if (isCopied) return
    copyToClipboard(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((error) => {
        console.error('Failed to copy!', error)
      })
  }

  return [isCopied, copy] as const
}
