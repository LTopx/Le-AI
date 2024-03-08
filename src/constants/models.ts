export type ModelProvider = 'openai' | 'claude'

export type Model = {
  model_name: string
  model_value: string
  model_token_limits: string
  model_vision: boolean
  model_plugin: boolean
}

export interface ModelList {
  model_provider: ModelProvider
  model_list: Model[]
}

export const MODEL_LISTS: ModelList[] = [
  {
    model_provider: 'openai',
    model_list: [
      {
        model_name: 'GPT-3.5',
        model_value: 'gpt-3.5-turbo',
        model_token_limits: '16K',
        model_vision: false,
        model_plugin: true,
      },
      {
        model_name: 'GPT-3.5 (0125)',
        model_value: 'gpt-3.5-turbo-0125',
        model_token_limits: '16K',
        model_vision: false,
        model_plugin: true,
      },
      {
        model_name: 'GPT-3.5 16K',
        model_value: 'gpt-3.5-turbo-16k',
        model_token_limits: '16K',
        model_vision: false,
        model_plugin: true,
      },
      {
        model_name: 'GPT-4',
        model_value: 'gpt-4',
        model_token_limits: '8K',
        model_vision: false,
        model_plugin: true,
      },
      {
        model_name: 'GPT-4 Turbo',
        model_value: 'gpt-4-turbo-preview',
        model_token_limits: '128K',
        model_vision: false,
        model_plugin: true,
      },
      {
        model_name: 'GPT-4 Vision',
        model_value: 'gpt-4-vision-preview',
        model_token_limits: '128K',
        model_vision: true,
        model_plugin: false,
      },
    ],
  },
  {
    model_provider: 'claude',
    model_list: [
      {
        model_name: 'Claude 3 Opus',
        model_value: 'claude-3-opus-20240229',
        model_token_limits: '200K',
        model_vision: true,
        model_plugin: false,
      },
      {
        model_name: 'Claude 3 Sonnet',
        model_value: 'claude-3-sonnet-20240229',
        model_token_limits: '200K',
        model_vision: true,
        model_plugin: false,
      },
    ],
  },
]
