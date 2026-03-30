export type ChatMode = 'qa' | 'generate' | 'explain' | 'copy'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

/** 发给后端的历史条（不含当前这条 user prompt） */
export interface ChatHistoryItem {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  mode: ChatMode
  prompt: string
  history: ChatHistoryItem[]
}

export interface ChatResponse {
  reply: string
}
