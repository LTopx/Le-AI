import { Message } from '@/store/chat'

export function Avatar({ role }: { role: Message['role'] }) {
  if (role === 'user') {
    return (
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
        <span className="i-mingcute-user-3-fill h-6 w-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[rgb(25,195,125)]">
      <span className="i-simple-icons-openai h-6 w-6 text-white" />
    </div>
  )
}
