import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="logo" width={32} height={32} />
      <div className="animate-flow bg-logo select-none bg-[size:400%] bg-clip-text text-2xl font-extrabold text-transparent">
        Le-AI
      </div>
    </div>
  )
}
