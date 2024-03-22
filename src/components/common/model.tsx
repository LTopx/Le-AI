import Image from 'next/image'

import { ModelProvider } from '@/constants/models'
import { cn } from '@/lib/utils'

export function Model({
  className,
  type,
  name,
  size = 9,
  iconSize = 6,
}: {
  className?: string
  type?: ModelProvider
  name?: string
  size?: number
  iconSize?: number
}) {
  if (!type || !name) {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-md bg-gray-200',
          className,
        )}
        style={{ width: 4 * size, height: 4 * size }}
      />
    )
  }

  if (type === 'openai') {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-md',
          {
            'bg-[rgb(25,195,125)]': name.includes('gpt-3.5'),
            'bg-[rgb(171,104,255)]': name.includes('gpt-4'),
          },
          className,
        )}
        style={{ width: 4 * size, height: 4 * size }}
      >
        <span
          className="i-simple-icons-openai text-white"
          style={{ width: 4 * iconSize, height: 4 * iconSize }}
        />
      </div>
    )
  }

  if (type === 'claude') {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-md bg-[#c49d7f]',
          className,
        )}
        style={{ width: 4 * size, height: 4 * size }}
      >
        <span
          className="i-logos-anthropic-icon !text-white"
          style={{ width: 4 * iconSize, height: 4 * iconSize }}
        />
      </div>
    )
  }

  if (type === 'groq') {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center overflow-hidden rounded-md',
          className,
        )}
      >
        <Image
          src="/models/groq.png"
          alt="groq"
          width={4 * size}
          height={4 * size}
        />
      </div>
    )
  }

  return null
}
