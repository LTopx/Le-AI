import { useCopy } from '@/hooks/useCopy'
import { cn } from '@/lib/utils'

export function Copy({
  className,
  text,
}: {
  className?: string
  text: string
}) {
  const [isCopied, copy] = useCopy()

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      onClick={() => copy(text)}
    >
      {isCopied ? (
        <span className="i-mingcute-check-line text-green-400" />
      ) : (
        <span className="i-mingcute-copy-2-line" />
      )}
    </div>
  )
}
