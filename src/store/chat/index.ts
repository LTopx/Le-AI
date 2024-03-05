import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { BASE_PROMPT, GENERATE_CHAT_NAME_PROMPT } from '@/lib/constant'

import { ChatListItem, ChatStore, LOADING_STATE, Message } from './type'

export type { LOADING_STATE, Message }

export const initChatItem: ChatListItem = {
  chat_id: nanoid(),
  chat_name: '',
  chat_model: {
    type: 'openai',
    name: 'gpt-3.5-turbo',
  },
  chat_prompt: BASE_PROMPT,
  chat_state: LOADING_STATE.NONE,
  chat_context_length: 8,
  chat_list: [],
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // State
      activeId: initChatItem.chat_id,
      list: [initChatItem],
      abort: {},

      // Chat
      switchChat: (chat_id) => set({ activeId: chat_id }),
      addChat: () => {
        const chat_id = nanoid()
        set((state) => ({
          list: [...state.list, { ...initChatItem, chat_id }],
          activeId: chat_id,
        }))
      },
      deleteChat: (chat_id) => {
        set((state) => {
          if (state.list.length <= 1) {
            const activeId = initChatItem.chat_id
            return { activeId, list: [initChatItem] }
          } else {
            const list = state.list.filter((item) => item.chat_id !== chat_id)

            if (chat_id === state.activeId) {
              return { activeId: list[0].chat_id, list }
            }

            return { list }
          }
        })
      },

      // Message
      addMessage: ({ chat_id, message, role }) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return

        findChat.chat_list.push({
          id: nanoid(),
          role,
          content: message,
          time: String(+new Date()),
        })

        set(() => ({ list: get().list }))
      },

      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'chat-list',
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      merge: (persistedState: any, currentState) => {
        // reset data
        if (persistedState) {
          persistedState.abort = {}
          persistedState.list.forEach((item: any) => {
            item.chat_state = LOADING_STATE.NONE
          })
        }

        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
