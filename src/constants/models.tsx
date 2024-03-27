import React from 'react'

export type ModelProvider = 'openai' | 'claude' | 'groq'

export type ModelPlugin = {
  label: string
  value: string
  icon: string | React.ReactNode
}

export type Model = {
  model_name: string
  model_value: string
  model_token_limits: string
  model_vision: boolean
  model_plugin?: boolean
}

export interface ModelList {
  model_provider: ModelProvider
  model_provider_label: string
  model_list: Model[]
}

/**
 * Plugins based on function calling
 * The premise is that the model must support function calling.
 */
export const MODEL_PLUGINS: ModelPlugin[] = [
  {
    label: 'Google Search',
    value: 'google_search',
    icon: <span className="class-name i-logos-google-icon h-5 w-5" />,
  },
  {
    label: 'DALL·E 3',
    value: 'dall_e_3',
    icon: (
      <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#df6b29]">
        <span className="i-simple-icons-openai text-white" />
      </div>
    ),
  },
]

export const MODEL_LIST: ModelList[] = [
  {
    model_provider: 'openai',
    model_provider_label: 'OpenAI',
    model_list: [
      // gpt-3.5
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
        model_name: 'GPT-3.5 (1106)',
        model_value: 'gpt-3.5-turbo-1106',
        model_token_limits: '16K',
        model_vision: false,
        model_plugin: true,
      },
      // gpt-4
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
    model_provider_label: 'Claude',
    model_list: [
      {
        model_name: 'Claude 3 Haiku',
        model_value: 'claude-3-haiku-20240307',
        model_token_limits: '200K',
        model_vision: false,
        model_plugin: false,
      },
      {
        model_name: 'Claude 3 Sonnet',
        model_value: 'claude-3-sonnet-20240229',
        model_token_limits: '200K',
        model_vision: false,
        model_plugin: false,
      },
      {
        model_name: 'Claude 3 Opus',
        model_value: 'claude-3-opus-20240229',
        model_token_limits: '200K',
        model_vision: false,
        model_plugin: false,
      },
    ],
  },
  {
    model_provider: 'groq',
    model_provider_label: 'GroqCloud',
    model_list: [
      // Meta
      {
        model_name: 'LLaMA2-70b',
        model_value: 'llama2-70b-4096',
        model_token_limits: '4K',
        model_vision: false,
        model_plugin: false,
      },
      // Mistral AI
      {
        model_name: 'Mixtral-8x7b',
        model_value: 'mixtral-8x7b-32768',
        model_token_limits: '32K',
        model_vision: false,
        model_plugin: false,
      },
      // Google
      {
        model_name: 'Gemma-7b-it',
        model_value: 'gemma-7b-it',
        model_token_limits: '8K',
        model_vision: false,
        model_plugin: false,
      },
    ],
  },
]
