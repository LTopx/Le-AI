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

    let finalEndpoint = ''
    if (endpoint !== undefined) {
      finalEndpoint = endpoint || 'https://api.openai.com'
    } else {
      finalEndpoint = model.endpoint || 'https://api.openai.com'
    }

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key || model.key}`,
      },
      endpoint: finalEndpoint,
      path: {
        chat: '/v1/chat/completions',
      },
    }
  } else if (provider === 'claude') {
    const model = useModelsStore.getState().claude

    let finalEndpoint = ''
    if (endpoint !== undefined) {
      finalEndpoint = endpoint || 'https://api.anthropic.com'
    } else {
      finalEndpoint = model.endpoint || 'https://api.anthropic.com'
    }

    return {
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': key || model.key,
      },
      endpoint: finalEndpoint,
      path: {
        chat: '/v1/messages',
      },
    }
  } else if (provider === 'groq') {
    const model = useModelsStore.getState().groq

    let finalEndpoint = ''
    if (endpoint !== undefined) {
      finalEndpoint = endpoint || 'https://api.groq.com/openai'
    } else {
      finalEndpoint = model.endpoint || 'https://api.groq.com/openai'
    }

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key ?? model.key}`,
      },
      endpoint: finalEndpoint,
      path: {
        chat: '/v1/chat/completions',
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
    if (provider === 'openai' || provider === 'groq')
      return JSON.parse(value).choices[0].delta.content
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
