<script setup lang="ts">
import MessageActions from './MessageActions.vue'
import { useCopy } from '../composables/useCopy'

const props = defineProps<{
  code: string
  language?: string
}>()

const { copied, copyText } = useCopy()

async function copyCode() {
  await copyText(props.code)
}
</script>

<template>
  <div class="code-wrap">
    <div class="title">{{ language || 'code' }}</div>
    <pre><code>{{ code }}</code></pre>
    <MessageActions :copied="copied" @copy="copyCode" />
  </div>
</template>

<style scoped>
.code-wrap {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #111827;
  color: #f9fafb;
  overflow: hidden;
}

.title {
  padding: 8px 12px;
  border-bottom: 1px solid #374151;
  font-size: 12px;
  color: #d1d5db;
}

pre {
  margin: 0;
  padding: 12px;
  overflow: auto;
}

code {
  font-family: Consolas, 'Courier New', monospace;
  font-size: 13px;
}

:deep(.actions) {
  padding: 0 12px 10px;
}

:deep(button) {
  border-color: #4b5563;
  color: #f3f4f6;
  background: #1f2937;
}
</style>
