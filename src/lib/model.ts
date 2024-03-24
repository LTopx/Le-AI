import { MODEL_LIST, ModelProvider } from '@/constants/models'
import { ChatModel } from '@/store/chat/type'

export function getCheapModel(model: ModelProvider) {
  if (model === 'openai') return 'gpt-3.5-turbo'
  if (model === 'claude') return 'claude-3-haiku-20240307'
  if (model === 'groq') return 'llama2-70b-4096'

  return ''
}

export function isVisionModel(chat_model?: ChatModel) {
  if (!chat_model) return false

  return !!MODEL_LIST.find(
    (val) => val.model_provider === chat_model.type,
  )?.model_list.find((item) => item.model_value === chat_model.name)
    ?.model_vision
}
