import type { ModelProvider } from '@/constants/models'

import { useModelsStore } from '../models'

export function generateFetchEventSource(provider: ModelProvider): {
  headers: Record<string, string>
  endpoint: string
} {
  if (provider === 'openai') {
    const model = useModelsStore.getState().openai

    if (!model.key) {
      throw new Error('OpenAI API key is required')
    }

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${model.key}`,
      },
      endpoint: model.endpoint || 'https://api.openai.com',
    }
  } else if (provider === 'claude') {
    const model = useModelsStore.getState().claude
    return {
      headers: {},
      endpoint: '',
    }
  }

  return { headers: {}, endpoint: '' }
}
