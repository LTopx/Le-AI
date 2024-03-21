import { ModelProvider } from '@/constants/models'

export function getCheapModel(model: ModelProvider) {
  if (model === 'openai') return 'gpt-3.5-turbo'
  if (model === 'claude') return 'claude-3-haiku-20240307'

  return ''
}