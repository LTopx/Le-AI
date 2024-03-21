import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DallE3Quality = 'standard' | 'hd'
export type DallE3Size = '1024x1024' | '1792x1024' | '1024x1792'
export type DallE3Style = 'vivid' | 'natural'

export type PluginStore = {
  // State
  dall_e_3: {
    quality: DallE3Quality
    size: DallE3Size
    style: DallE3Style
  }

  // Actions
  updateDallE3: (dall_e_3: {
    quality: DallE3Quality
    size: DallE3Size
    style: DallE3Style
  }) => void
}

export const usePluginsStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      // State
      dall_e_3: {
        quality: 'standard',
        size: '1024x1024',
        style: 'vivid',
      },

      // Actions
      updateDallE3: (dall_e_3) => set({ dall_e_3 }),
    }),
    { name: 'chat-plugins' },
  ),
)
