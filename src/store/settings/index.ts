import { create } from 'zustand'

interface SettingsStore {
  // Side Menu State
  open: boolean

  updateOpen: () => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  open: false,
  updateOpen: () => set({ open: !get().open }),
}))
