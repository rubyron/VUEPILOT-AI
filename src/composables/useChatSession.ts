import { computed, ref } from 'vue'
import { chatWithAI } from '../api/chat'
import { useChatStore } from '../stores/chat'

export function useChatSession() {
  const { state, appendMessage, setLoading } = useChatStore()
  const draft = ref('')
  const canSend = computed(() => !!draft.value.trim() && !state.loading)

  async function send() {
    const prompt = draft.value.trim()
    if (!prompt) return

    appendMessage('user', prompt)
    draft.value = ''
    setLoading(true)

    try {
      const historyForApi = state.messages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await chatWithAI({
        mode: state.mode,
        prompt,
        history: historyForApi,
      })
      appendMessage('assistant', response.reply)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      appendMessage('assistant', `请求失败：${message}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    state,
    draft,
    canSend,
    send,
  }
}
