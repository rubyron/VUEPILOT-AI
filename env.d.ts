/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 设为 true 时走前端 mock，不请求后端（默认不接） */
  readonly VITE_USE_CHAT_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
