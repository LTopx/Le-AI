import { create } from 'zustand'

interface CommonStore {
  // Side Menu State
  isPCSideMenuOpen: boolean
  isMSideMenuOpen: boolean

  togglePCSideMenu: () => void
  toggleMSideMenu: () => void
}

export const useCommonStore = create<CommonStore>((set, get) => ({
  // Side Menu State
  isPCSideMenuOpen: true,
  isMSideMenuOpen: false,
  togglePCSideMenu: () =>
    set((state) => ({ isPCSideMenuOpen: !state.isPCSideMenuOpen })),
  toggleMSideMenu: () =>
    set((state) => ({ isMSideMenuOpen: !state.isMSideMenuOpen })),

  // Others
}))
