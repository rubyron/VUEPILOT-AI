import { ref } from 'vue'

export function useCopy() {
  const copied = ref(false)

  async function copyText(text: string): Promise<boolean> {
    if (!text) return false
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1200)
    return true
  }

  return { copied, copyText }
}
