/**
 * 本地 Node 接口：POST /api/chat
 * 与根目录 api/chat.ts（Vercel）行为一致：阿里云百炼 DashScope OpenAI 兼容 /compatible-mode/v1/chat/completions
 *
 * 运行（二选一）：
 *   1) 先配置环境变量再：npm run server
 *   2) Node 20.6+：npm run server:env（读取 .env.local）
 *
 * 与前端联调：另开终端 npm run dev，Vite 会把 /api 代理到本服务。
 */
import http from 'node:http'
import { URL } from 'node:url'

const PORT = Number(process.env.API_PORT || 8787)

/** @typedef {'qa'|'generate'|'explain'|'copy'} ChatMode */

/** @param {ChatMode} mode */
function getSystemPrompt(mode) {
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

/** @param {string|undefined} mode */
function normalizeMode(mode) {
  if (mode === 'qa' || mode === 'generate' || mode === 'explain' || mode === 'copy') {
    return mode
  }
  return 'qa'
}

function getDashScopeConfig() {
  const apiKey = process.env.DASHSCOPE_API_KEY ?? process.env.OPENAI_API_KEY
  const baseUrl = (
    process.env.DASHSCOPE_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    'https://dashscope.aliyuncs.com/compatible-mode/v1'
  ).replace(/\/$/, '')
  const model = process.env.DASHSCOPE_MODEL ?? process.env.OPENAI_MODEL ?? 'qwen-plus'

  if (!apiKey) {
    throw new Error('Missing DASHSCOPE_API_KEY（阿里云百炼 API Key）')
  }

  return { apiKey, baseUrl, model }
}

/**
 * @param {ChatMode} mode
 * @param {string} prompt
 * @param {{ role: string, content: string }[]} history
 */
async function callModel(mode, prompt, history) {
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

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  return typeof content === 'string' ? content.trim() : ''
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host ?? `localhost:${PORT}`
  let pathname
  try {
    pathname = new URL(req.url ?? '/', `http://${host}`).pathname
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ message: 'Bad Request' }))
    return
  }

  if (pathname !== '/api/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ message: 'Not Found' }))
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ message: 'Method Not Allowed' }))
    return
  }

  let raw = ''
  try {
    for await (const chunk of req) {
      raw += chunk
    }
    const body = raw ? JSON.parse(raw) : {}
    const mode = normalizeMode(body.mode)
    const prompt = String(body.prompt ?? '').trim()
    const history = Array.isArray(body.history) ? body.history : []

    if (!prompt) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ message: 'prompt is required' }))
      return
    }

    const reply = await callModel(mode, prompt, history)
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ reply }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ message }))
  }
})

server.listen(PORT, () => {
  console.log(`[server] POST http://localhost:${PORT}/api/chat`)
  console.log('[server] 确保已设置 DASHSCOPE_API_KEY（可用 .env.local + npm run server:env）')
})
