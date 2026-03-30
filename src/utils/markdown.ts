export interface MarkdownBlock {
  type: 'text' | 'code'
  content: string
  language?: string
}

export function parseMarkdownBlocks(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(source)) !== null) {
    const textPart = source.slice(lastIndex, match.index).trim()
    if (textPart) blocks.push({ type: 'text', content: textPart })

    blocks.push({
      type: 'code',
      language: match[1] || undefined,
      content: match[2].trim(),
    })
    lastIndex = regex.lastIndex
  }

  const tail = source.slice(lastIndex).trim()
  if (tail) blocks.push({ type: 'text', content: tail })
  if (blocks.length === 0) blocks.push({ type: 'text', content: source })

  return blocks
}
