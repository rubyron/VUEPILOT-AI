<script setup lang="ts">
import CodeBlock from './CodeBlock.vue'
import MessageActions from './MessageActions.vue'
import { useCopy } from '../composables/useCopy'
import type { ChatMessage as ChatMessageType } from '../types/chat'
import { parseMarkdownBlocks } from '../utils/markdown'

const props = defineProps<{
  message: ChatMessageType
}>()

const { copied, copyText } = useCopy()

async function copyMessage() {
  await copyText(props.message.content)
}
</script>

<template>
  <article class="message" :class="message.role">
    <header class="meta">
      <strong>{{ message.role === 'user' ? '你' : 'AI 助手' }}</strong>
    </header>

    <div class="content">
      <template v-for="(block, index) in parseMarkdownBlocks(message.content)" :key="index">
        <p v-if="block.type === 'text'" class="text">{{ block.content }}</p>
        <CodeBlock v-else :code="block.content" :language="block.language" />
      </template>
    </div>

    <MessageActions :copied="copied" @copy="copyMessage" />
  </article>
</template>

<style scoped>
.message {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.message.user {
  border-color: #c7d2fe;
  background: #eef2ff;
}

.meta {
  margin-bottom: 8px;
}

.content {
  display: grid;
  gap: 10px;
}

.text {
  margin: 0;
  white-space: pre-wrap;
  color: #1f2937;
}
</style>
