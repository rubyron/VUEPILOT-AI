import type { ChatRequest, ChatResponse } from '../types/chat'

function mockReply(request: ChatRequest): string {
  const { mode, prompt } = request
  if (mode === 'qa') {
    return `问答模式示例回复：\n\n${prompt}\n\n提示：接入真实模型后会返回更准确答案。`
  }
  if (mode === 'generate') {
    return `\`\`\`ts
// 代码生成示例
export function hello(name: string): string {
  return \`Hello, \${name}\`
}
\`\`\`

需求摘要：${prompt}`
  }
  if (mode === 'explain') {
    return `解释模式示例：\n1. 该代码实现了基础逻辑封装。\n2. 通过函数参数提升可复用性。\n3. 可加上错误处理提升健壮性。\n\n原文：${prompt}`
  }
  return `${prompt}\n\n已整理，可直接复制。`
}

function isMockMode(): boolean {
  return import.meta.env.VITE_USE_CHAT_MOCK === 'true'
}

export async function chatWithAI(payload: ChatRequest): Promise<ChatResponse> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { reply: mockReply(payload) }
  }

  let response: Response
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    const hint =
      '无法连接 /api/chat。请先在本机运行：npm run server:env（需 .env.local 含 DASHSCOPE_API_KEY），并保证与 npm run dev 同时运行。'
    throw new Error(e instanceof Error ? `${e.message}。${hint}` : hint)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error(`HTTP ${response.status}：响应不是 JSON`)
  }

  const record = data as { reply?: unknown; message?: unknown }

  if (!response.ok) {
    const msg =
      typeof record.message === 'string'
        ? record.message
        : typeof record.reply === 'string'
          ? record.reply
          : `HTTP ${response.status}`
    throw new Error(msg)
  }

  if (typeof record.reply !== 'string' || !record.reply.trim()) {
    throw new Error('无效响应：缺少 reply 字段')
  }

  return { reply: record.reply }
}
