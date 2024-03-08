import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex select-none items-center gap-2">
      <Image src="/logo.png" alt="logo" width={30} height={30} />
      <div className="animate-flow select-none bg-logo bg-[size:400%] bg-clip-text text-2xl font-extrabold text-transparent">
        Le-AI
      </div>
    </div>
  )
}
