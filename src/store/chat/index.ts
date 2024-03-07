import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { BASE_PROMPT, GENERATE_CHAT_NAME_PROMPT } from '@/lib/constant'
import { fetchEventSource } from '@fortaine/fetch-event-source'

import { ChatListItem, ChatStore, LOADING_STATE, Message } from './type'

export type { Message }
export { LOADING_STATE }

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

      // Action
      sendChat: (chat_id) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return

        findChat.chat_state = LOADING_STATE.CONNECTING

        set(() => ({ list: get().list }))

        // last 10 messages
        const messages = findChat.chat_list.slice(-10).map((item) => ({
          role: item.role,
          content: item.content,
        }))

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEV_API_KEY}`,
        }

        const controller = new AbortController()

        fetchEventSource('http://localhost:3001/api/chat', {
          method: 'POST',
          signal: controller.signal,
          openWhenHidden: true,
          headers,
          body: JSON.stringify({
            stream: true,
            model: 'gpt-3.5-turbo',
            messages,
          }),
          onopen: async (res) => {
            const resError = !res.ok || res.status !== 200 || !res.body
            if (!resError) return

            findChat.chat_state = LOADING_STATE.NONE
            set(() => ({ list: get().list }))
          },
          onmessage: (res) => {
            if (res.data === '[DONE]') {
              findChat.chat_state = LOADING_STATE.NONE

              if (!findChat.chat_name) {
                get().generateChatName(chat_id)
              }

              set(() => ({ list: get().list }))

              return
            }

            try {
              const lastItem = findChat.chat_list.at(-1)
              if (!lastItem) return

              const content = JSON.parse(res.data).choices[0].delta.content
              if (!content) return

              findChat.chat_state = LOADING_STATE.RESPONDING

              if (lastItem.role === 'user') {
                findChat.chat_list.push({
                  id: nanoid(),
                  role: 'assistant',
                  time: String(+new Date()),
                  content,
                })
              } else {
                lastItem.content += content
              }
              set(() => ({ list: get().list }))
            } catch {}
          },
          onerror: () => {
            findChat.chat_state = LOADING_STATE.NONE
            set(() => ({ list: get().list }))

            throw null
          },
        })
      },
      generateChatName: (chat_id) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return

        // last 10 messages
        const messages = findChat.chat_list.slice(-10).map((item) => ({
          role: item.role,
          content: item.content,
        }))

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEV_API_KEY}`,
        }

        fetchEventSource('http://localhost:3001/api/chat', {
          method: 'POST',
          openWhenHidden: true,
          headers,
          body: JSON.stringify({
            stream: true,
            model: 'gpt-3.5-turbo',
            messages: [
              ...messages,
              { role: 'user', content: GENERATE_CHAT_NAME_PROMPT },
            ],
          }),
          // Not set onopen will lead to content-type error: `Error: Expected content-type to be text/event-stream, Actual: null`
          onopen: async () => {},
          onmessage: (res) => {
            if (res.data === '[DONE]') return

            try {
              const content = JSON.parse(res.data).choices[0].delta.content
              if (!content) return

              findChat.chat_name += content

              set(() => ({ list: get().list }))
            } catch {}
          },
          onerror: (error) => {
            console.log(error, 'generateChatName error')
            throw null
          },
        })
      },
      stopChat: () => {},

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
