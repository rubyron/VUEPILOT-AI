import type { ChatMessage, ChatMode } from '../types/chat'

const MODE_KEY = 'vuepilot:chat:mode'
const HISTORY_KEY = 'vuepilot:chat:history'

export function loadMode(): ChatMode | null {
  const value = localStorage.getItem(MODE_KEY)
  if (value === 'qa' || value === 'generate' || value === 'explain' || value === 'copy') {
    return value
  }
  return null
}

export function saveMode(mode: ChatMode): void {
  localStorage.setItem(MODE_KEY, mode)
}

export function loadMessages(): ChatMessage[] {
  const raw = localStorage.getItem(HISTORY_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as ChatMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(messages))
}
