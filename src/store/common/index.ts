import { create } from 'zustand'

interface CommonStore {
  // Side Menu
  isPCSideMenuOpen: boolean
  isMSideMenuOpen: boolean
  togglePCSideMenu: () => void
  toggleMSideMenu: () => void

  // Settings
  settingsOpen: boolean
  updateSettingsOpen: () => void
}

export const useCommonStore = create<CommonStore>((set, get) => ({
  // Side Menu
  isPCSideMenuOpen: true,
  isMSideMenuOpen: false,
  togglePCSideMenu: () =>
    set((state) => ({ isPCSideMenuOpen: !state.isPCSideMenuOpen })),
  toggleMSideMenu: () =>
    set((state) => ({ isMSideMenuOpen: !state.isMSideMenuOpen })),

  // Settings
  settingsOpen: false,
  updateSettingsOpen: () =>
    set((state) => ({ settingsOpen: !state.settingsOpen })),
}))
