import type { ModelProvider } from '@/constants/models'

import { useModelsStore } from '../models'

export function getRequestInfo(
  provider: ModelProvider,
  key?: string,
  endpoint?: string,
): {
  headers: Record<string, string>
  endpoint: string
  path: Record<string, string>
} {
  if (provider === 'openai') {
    const model = useModelsStore.getState().openai

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key || model.key}`,
      },
      endpoint: endpoint || model.endpoint || 'https://api.openai.com',
      path: {
        chat: '/v1/chat/completions',
      },
    }
  } else if (provider === 'claude') {
    const model = useModelsStore.getState().claude
    return {
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': key || model.key,
      },
      endpoint: endpoint || model.endpoint || 'https://api.anthropic.com',
      path: {
        chat: '/v1/messages',
      },
    }
  }

  return {
    headers: {},
    endpoint: '',
    path: {
      chat: '',
    },
  }
}

export function getEventSourceContent(value: string, provider: ModelProvider) {
  try {
    if (provider === 'openai') return JSON.parse(value).choices[0].delta.content
    if (provider === 'claude') {
      return (
        JSON.parse(value).content_block?.text || JSON.parse(value).delta?.text
      )
    }
    return ''
  } catch (error) {
    return ''
  }
}
