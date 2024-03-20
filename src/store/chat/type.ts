import type { ModelProvider } from '@/constants/models'

export type ChatModel = {
  type: ModelProvider
  name: string
}

export type ChatRole =
  | 'system'
  | 'user'
  | 'assistant'
  | 'function'
  | 'data'
  | 'tool'

export enum LOADING_STATE {
  NONE, // Not loading
  CONNECTING, // Requesting to server
  RESPONDING, // Responding from server
}

export type Message = {
  id: string
  role: ChatRole
  time: string
  content: string
}

export type ChatListItem = {
  chat_id: string
  chat_name: string
  chat_model: ChatModel
  chat_prompt: string
  chat_state: LOADING_STATE
  chat_context_length: number
  chat_list: Message[]
  chat_plugins: string[]
}

export type ChatStore = {
  // State
  activeId: string
  list: ChatListItem[]
  abort: Record<string, AbortController>
  recentModel: ChatModel

  // Chat
  switchChat: (chat_id: string) => void
  addChat: () => void
  deleteChat: (chat_id: string) => void
  updateChat: (chat_id: string, data: Partial<ChatListItem>) => void
  clearChat: () => void

  // Message
  addMessage: ({
    chat_id,
    message,
    role,
  }: {
    chat_id: string
    message: string
    role: ChatRole
  }) => void
  deleteMessage: (message_id: string) => void
  updateMessage: (message_id: string, content: string) => void
  clearMessage: (chat_id: string) => void

  // Action
  sendChat: (chat_id: string) => void
  regenerateChat: (message_id: string) => void
  generateChatName: (chat_id: string) => void
  stopChat: (chat_id: string) => void

  // Other
  updateRecentModel: (model: ChatModel) => void

  // Hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
