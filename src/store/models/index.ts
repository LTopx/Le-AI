import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ModelStore = {
  // State
  openai: {
    key: string
    endpoint: string
    error: boolean
  }
  claude: {
    key: string
    endpoint: string
    error: boolean
  }
  groq: {
    key: string
    endpoint: string
    error: boolean
  }

  // Actions
  updateOpenai: (openai: {
    key: string
    endpoint: string
    error: boolean
  }) => void
  updateClaude: (claude: {
    key: string
    endpoint: string
    error: boolean
  }) => void
  updateGroq: (groq: { key: string; endpoint: string; error: boolean }) => void
}

export const useModelsStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      // State
      openai: {
        key: '',
        endpoint: '',
        error: true,
      },
      claude: {
        key: '',
        endpoint: '',
        error: true,
      },
      groq: {
        key: '',
        endpoint: '',
        error: true,
      },

      // Actions
      updateOpenai: (openai) => set({ openai }),
      updateClaude: (claude) => set({ claude }),
      updateGroq: (groq) => set({ groq }),
    }),
    { name: 'chat-models' },
  ),
)
