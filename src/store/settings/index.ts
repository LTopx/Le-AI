import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  // State
  avatar: string
  generate_recommended_questions: boolean

  // Action
  updateAvatar: (avatar: string) => void
  updateGenerateRecommendedQuestions: (
    generate_recommended_questions: boolean,
  ) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // State
      avatar: '',
      generate_recommended_questions: true,

      // Actions
      updateAvatar: (avatar) => set({ avatar }),
      updateGenerateRecommendedQuestions: (generate_recommended_questions) =>
        set({ generate_recommended_questions }),
    }),
    { name: 'chat-settings' },
  ),
)
