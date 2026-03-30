import type { VercelRequest, VercelResponse } from '@vercel/node'

type ChatMode = 'qa' | 'generate' | 'explain' | 'copy'

interface IncomingMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  mode?: ChatMode
  prompt?: string
  history?: IncomingMessage[]
}

function getSystemPrompt(mode: ChatMode): string {
  if (mode === 'generate') {
    return '你是资深 Vue/TypeScript 工程师。优先输出可运行代码，并给出简短说明。'
  }
  if (mode === 'explain') {
    return '你是代码讲解助手。用清晰条目解释代码逻辑、关键语法和可改进点。'
  }
  if (mode === 'copy') {
    return '你是代码整理助手。保留原意，优化格式，输出便于直接复制使用的内容。'
  }
  return '你是中文技术问答助手，回答简洁准确。'
}

function normalizeMode(mode?: string): ChatMode {
  if (mode === 'qa' || mode === 'generate' || mode === 'explain' || mode === 'copy') {
    return mode
  }
  return 'qa'
}

/** 阿里云百炼（DashScope）OpenAI 兼容模式，见：https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope */
function getDashScopeConfig() {
  const apiKey = process.env.DASHSCOPE_API_KEY ?? process.env.OPENAI_API_KEY
  const baseUrl = (
    process.env.DASHSCOPE_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    'https://dashscope.aliyuncs.com/compatible-mode/v1'
  ).replace(/\/$/, '')
  const model = process.env.DASHSCOPE_MODEL ?? process.env.OPENAI_MODEL ?? 'qwen-plus'

  if (!apiKey) {
    throw new Error('Missing DASHSCOPE_API_KEY（阿里云百炼 API Key，控制台创建）')
  }

  return { apiKey, baseUrl, model }
}

async function callModel(mode: ChatMode, prompt: string, history: IncomingMessage[]) {
  const { apiKey, baseUrl, model } = getDashScopeConfig()

  const messages = [
    { role: 'system', content: getSystemPrompt(mode) },
    ...history.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: 'user', content: prompt },
  ]

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Model API ${response.status}: ${text}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const body = (req.body ?? {}) as RequestBody
    const mode = normalizeMode(body.mode)
    const prompt = String(body.prompt ?? '').trim()
    const history = Array.isArray(body.history) ? body.history : []

    if (!prompt) {
      res.status(400).json({ message: 'prompt is required' })
      return
    }

    const reply = await callModel(mode, prompt, history)
    res.status(200).json({ reply })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    res.status(500).json({ message })
  }
}
