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
  activeSettingsMenu: string
  updateActiveSettingsMenu: (menu: string) => void
}

export const menus = [
  {
    label: 'General',
    value: 'general',
    icon: 'i-mingcute-settings-4-fill',
  },
  {
    label: 'Models',
    value: 'models',
    icon: 'i-mdi-database',
  },
  {
    label: 'Plugins',
    value: 'plugins',
    icon: 'i-mingcute-cloud-fill',
  },
  {
    label: 'About',
    value: 'about',
    icon: 'i-mdi-information',
  },
]

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
  updateSettingsOpen: () => {
    set((state) => ({ settingsOpen: !state.settingsOpen }))
  },
  activeSettingsMenu: menus[0].value,
  updateActiveSettingsMenu: (menu: string) => {
    const findMenu = menus.find((item) => item.value === menu)
    if (!findMenu) {
      set(() => ({ activeSettingsMenu: menus[0].value }))
    } else {
      set(() => ({ activeSettingsMenu: menu }))
    }
  },
}))
