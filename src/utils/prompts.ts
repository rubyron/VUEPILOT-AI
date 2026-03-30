import type { ChatMode } from '../types/chat'

const modeLabelMap: Record<ChatMode, string> = {
  qa: '普通问答',
  generate: '代码生成',
  explain: '代码解释',
  copy: '代码复制',
}

const placeholderMap: Record<ChatMode, string> = {
  qa: '请输入问题，例如：Vue 的 watch 和 computed 区别？',
  generate: '请输入需求，例如：生成一个带分页表格的 Vue 组件',
  explain: '贴入代码或描述代码片段，我将解释其逻辑',
  copy: '贴入需要整理后复制的代码或文本',
}

export function getModeLabel(mode: ChatMode): string {
  return modeLabelMap[mode]
}

export function getModePlaceholder(mode: ChatMode): string {
  return placeholderMap[mode]
}
