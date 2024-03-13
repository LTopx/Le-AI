import { ModelProvider } from '@/constants/models'

export function getCheapModel(model: ModelProvider) {
  if (model === 'openai') return 'gpt-3.5-turbo'
  if (model === 'claude') return 'claude-instant-1.2'

  return ''
}
