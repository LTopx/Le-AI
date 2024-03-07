export type ChatModel = {
  type: string
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
}

export type ChatStore = {
  // State
  activeId: string
  list: ChatListItem[]
  abort: Record<string, AbortController>

  // Chat
  switchChat: (chat_id: string) => void
  addChat: () => void
  deleteChat: (chat_id: string) => void

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

  // Action
  sendChat: (chat_id: string) => void
  generateChatName: (chat_id: string) => void
  stopChat: (chat_id: string) => void

  // Hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
