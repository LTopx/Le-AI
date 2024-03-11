import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ModelStore = {
  // State
  openai: {
    key: string
    endpoint: string
  }
  claude: {
    key: string
    endpoint: string
  }

  // Actions
  updateOpenai: (openai: { key: string; endpoint: string }) => void
  // updateRecentModel: (recentModel: ChatModel) => void
}

export const useModelsStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      // State
      openai: {
        key: '',
        endpoint: '',
      },
      claude: {
        key: '',
        endpoint: '',
      },

      // Actions
      updateOpenai: (openai) => set({ openai }),
    }),
    { name: 'chat-models' },
  ),
)
