import { Claude } from './claude'
import { OpenAI } from './openai'

export function Models() {
  return (
    <div className="grid w-full items-center gap-4">
      <OpenAI />
      <Claude />
    </div>
  )
}
