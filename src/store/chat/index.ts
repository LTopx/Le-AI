import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { MODEL_LIST } from '@/constants/models'
import { BASE_PROMPT, GENERATE_CHAT_NAME_PROMPT } from '@/constants/prompt'
import { getCheapModel } from '@/lib/model'
import { scrollToBottom } from '@/lib/scroll'
import { clone } from '@/lib/utils'
import { fetchEventSource } from '@fortaine/fetch-event-source'

import { useModelsStore } from '../models'
import { ChatListItem, ChatStore, LOADING_STATE, Message } from './type'
import { getEventSourceContent, getRequestInfo } from './utils'

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
  chat_plugins: [],
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // State
      activeId: initChatItem.chat_id,
      list: [initChatItem],
      abort: {},
      recentModel: {
        type: 'openai',
        name: 'gpt-3.5-turbo',
      },

      // Chat
      switchChat: (chat_id) => set({ activeId: chat_id }),
      addChat: () => {
        const chat_id = nanoid()
        set((state) => ({
          list: [
            ...state.list,
            { ...clone(initChatItem), chat_id, chat_model: get().recentModel },
          ],
          activeId: chat_id,
        }))
      },
      deleteChat: (chat_id) => {
        set((state) => {
          if (state.list.length <= 1) {
            const activeId = initChatItem.chat_id
            return { activeId, list: [clone(initChatItem)] }
          } else {
            const list = state.list.filter((item) => item.chat_id !== chat_id)

            if (chat_id === state.activeId) {
              return { activeId: list[0].chat_id, list }
            }

            return { list }
          }
        })
      },
      updateChat: (chat_id, data) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return

        if (data.chat_name) {
          findChat.chat_name = data.chat_name
        }

        if (data.chat_list) {
          findChat.chat_list = data.chat_list
        }

        if (data.chat_model) {
          findChat.chat_model = data.chat_model
          get().updateRecentModel(data.chat_model)
        }

        if (data.chat_plugins) {
          findChat.chat_plugins = data.chat_plugins
        }

        set(() => ({ list: get().list }))
      },
      clearChat: () => {
        set(() => ({
          activeId: initChatItem.chat_id,
          list: [{ ...clone(initChatItem), chat_model: get().recentModel }],
        }))
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
        scrollToBottom()
      },
      deleteMessage: (message_id) => {
        const activeId = get().activeId
        const findChat = get().list.find((item) => item.chat_id === activeId)
        if (!findChat) return

        findChat.chat_list = findChat.chat_list.filter(
          (item) => item.id !== message_id,
        )

        set(() => ({ list: get().list }))
      },
      updateMessage: (message_id, content) => {
        const activeId = get().activeId
        const findChat = get().list.find((item) => item.chat_id === activeId)
        if (!findChat) return

        const findMessage = findChat.chat_list.find(
          (item) => item.id === message_id,
        )
        if (!findMessage) return

        findMessage.content = content

        set(() => ({ list: get().list }))
      },
      clearMessage: (chat_id) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return
        findChat.chat_list = []
        set(() => ({ list: get().list }))
      },

      // Action
      sendChat: (chat_id) => {
        try {
          const findChat = get().list.find((item) => item.chat_id === chat_id)
          if (!findChat) return

          if (!useModelsStore.getState()[findChat.chat_model.type]?.key) {
            return toast.error('API key is required')
          }

          const { headers, endpoint, path } = getRequestInfo(
            findChat.chat_model.type,
          )

          findChat.chat_state = LOADING_STATE.CONNECTING

          set(() => ({ list: get().list }))

          // last 10 messages
          const messages = findChat.chat_list.slice(-10).map((item) => ({
            role: item.role,
            content: item.content,
          }))

          const controller = new AbortController()
          set((state) => ({ abort: { ...state.abort, [chat_id]: controller } }))
          fetchEventSource(`${endpoint}${path.chat}`, {
            headers,
            method: 'POST',
            signal: controller.signal,
            openWhenHidden: true,
            body: JSON.stringify({
              stream: true,
              model: findChat.chat_model.name,
              messages,
              function_calling: findChat.chat_plugins,
            }),
            onopen: async (res) => {
              const resError = !res.ok || res.status !== 200 || !res.body
              if (!resError) return

              const error = await res.json()
              toast.error(error.msg || 'Internal server error')

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

                const content = getEventSourceContent(
                  res.data,
                  findChat.chat_model.type,
                )

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

                // auto-scroll-to-bottom
                if (chat_id === get().activeId) scrollToBottom()
              } catch {}
            },
            onerror: () => {
              findChat.chat_state = LOADING_STATE.NONE
              set(() => ({ list: get().list }))

              throw null
            },
          })
        } catch (error: any) {
          toast.error(error.message || 'Internal server error')
        }
      },
      regenerateChat: (message_id) => {
        const activeId = get().activeId
        const findChat = get().list.find((item) => item.chat_id === activeId)
        if (!findChat) return

        const findMessage = findChat.chat_list.find(
          (item) => item.id === message_id,
        )
        const findMessageIndex = findChat.chat_list.findIndex(
          (item) => item.id === message_id,
        )
        if (!findMessage) return

        let arr: Message[] = []

        if (findMessage.role === 'assistant') {
          arr = findChat.chat_list.slice(0, findMessageIndex)
        } else if (findMessage.role === 'user') {
          arr = findChat.chat_list.slice(0, findMessageIndex + 1)
        }

        findChat.chat_list = arr
        set(() => ({ list: get().list }))
        get().sendChat(activeId)
      },
      generateChatName: (chat_id) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return

        if (!useModelsStore.getState()[findChat.chat_model.type]?.key) {
          return toast.error('API key is required')
        }

        const { headers, endpoint, path } = getRequestInfo(
          findChat.chat_model.type,
        )

        // last 10 messages
        const messages = findChat.chat_list.slice(-10).map((item) => ({
          role: item.role,
          content: item.content,
        }))

        fetchEventSource(`${endpoint}${path.chat}`, {
          headers,
          method: 'POST',
          openWhenHidden: true,
          body: JSON.stringify({
            stream: true,
            // Generate the title using the cheapest model available from the current supplier.
            model: getCheapModel(findChat.chat_model.type),
            messages: [
              ...messages,
              { role: 'user', content: GENERATE_CHAT_NAME_PROMPT },
            ],
          }),
          // Not set onopen will lead to content-type error: `Error: Expected content-type to be text/event-stream, Actual: null`
          onopen: async (res) => {
            const resError = !res.ok || res.status !== 200 || !res.body
            if (!resError) return

            const error = await res.json()
            toast.error(error.msg || 'Internal server error')
          },
          onmessage: (res) => {
            if (res.data === '[DONE]') return

            try {
              const content = getEventSourceContent(
                res.data,
                findChat.chat_model.type,
              )
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
      stopChat: (chat_id) => {
        const findController = get().abort[chat_id]
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findController || !findChat) return

        findController.abort()
        delete get().abort[chat_id]

        findChat.chat_state = LOADING_STATE.NONE

        set(() => ({ abort: get().abort, list: get().list }))
      },

      // Other
      updateRecentModel: (recentModel) => set({ recentModel }),

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

          // If a model is deprecated and cannot be matched with existing models, it needs to be reset to the latest initial model.
          // 1. check recentModel
          if (
            !MODEL_LIST.some(
              (item) =>
                item.model_provider === persistedState.recentModel.type &&
                item.model_list.some(
                  (model) =>
                    model.model_value === persistedState.recentModel.name,
                ),
            )
          ) {
            persistedState.recentModel = {
              type: MODEL_LIST[0].model_provider,
              name: MODEL_LIST[0].model_list[0].model_value,
            }
          }
          // 2. check list chat_model
          persistedState.list.forEach((item: any) => {
            item.chat_state = LOADING_STATE.NONE

            if (
              !MODEL_LIST.some(
                (model) =>
                  model.model_provider === item.chat_model.type &&
                  model.model_list.some(
                    (model) => model.model_value === item.chat_model.name,
                  ),
              )
            ) {
              item.chat_model = {
                type: MODEL_LIST[0].model_provider,
                name: MODEL_LIST[0].model_list[0].model_value,
              }
            }

            if (!item.chat_plugins) item.chat_plugins = []
          })
        }

        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
