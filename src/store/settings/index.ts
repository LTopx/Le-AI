import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  // State
  avatar: string

  // Action
  updateAvatar: (avatar: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // State
      avatar: '',

      // Actions
      updateAvatar: (avatar) => set({ avatar }),
    }),
    { name: 'chat-settings' },
  ),
)
