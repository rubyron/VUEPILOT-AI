import { reactive } from 'vue'
import type { ChatMessage, ChatMode } from '../types/chat'
import { loadMessages, loadMode, saveMessages, saveMode } from '../utils/storage'

interface ChatState {
  mode: ChatMode
  loading: boolean
  messages: ChatMessage[]
}

const state = reactive<ChatState>({
  mode: loadMode() ?? 'qa',
  loading: false,
  messages: loadMessages(),
})

function setMode(mode: ChatMode) {
  state.mode = mode
  saveMode(mode)
}

function setLoading(loading: boolean) {
  state.loading = loading
}

function appendMessage(role: ChatMessage['role'], content: string) {
  const message: ChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  }
  state.messages.push(message)
  saveMessages(state.messages)
}

function clearMessages() {
  state.messages = []
  saveMessages([])
}

export function useChatStore() {
  return {
    state,
    setMode,
    setLoading,
    appendMessage,
    clearMessages,
  }
}
