<script setup lang="ts">
import { computed } from 'vue'
import ChatInput from '../components/ChatInput.vue'
import ChatMessage from '../components/ChatMessage.vue'
import ModeTabs from '../components/ModeTabs.vue'
import { useChatSession } from '../composables/useChatSession'
import { useChatStore } from '../stores/chat'
import { getModePlaceholder } from '../utils/prompts'

const { state, draft, canSend, send } = useChatSession()
const { setMode, clearMessages } = useChatStore()

const historyItems = computed(() => {
  return state.messages
    .filter((message) => message.role === 'user')
    .map((message) => ({
      id: message.id,
      title: message.content.trim().slice(0, 28) || '空白消息',
      createdAt: new Date(message.createdAt).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))
    .reverse()
})
</script>

<template>
  <main class="home">
    <section class="panel">
      <aside class="sidebar">
        <header class="side-header">
          <h2>历史对话</h2>
          <button type="button" @click="clearMessages">清空</button>
        </header>

        <ul v-if="historyItems.length > 0" class="history-list">
          <li v-for="item in historyItems" :key="item.id">
            <span class="history-title">{{ item.title }}</span>
            <time class="history-time">{{ item.createdAt }}</time>
          </li>
        </ul>
        <p v-else class="history-empty">暂无历史记录</p>
      </aside>

      <section class="chat-area">
        <header class="chat-top">
          <div>
            <h1>Vue AI 助手</h1>
            <p>支持普通问答、代码生成、代码解释与复制。</p>
          </div>
          <ModeTabs :model-value="state.mode" @update:model-value="setMode" />
        </header>

        <section class="messages">
          <ChatMessage v-for="message in state.messages" :key="message.id" :message="message" />
          <p v-if="state.messages.length === 0" class="empty">还没有消息，先发送一条吧。</p>
        </section>

        <footer class="chat-bottom">
          <p v-if="state.loading" class="loading-tip">AI 正在处理中...</p>
          <ChatInput
            v-model="draft"
            :disabled="state.loading"
            :can-submit="canSend"
            :placeholder="getModePlaceholder(state.mode)"
            @submit="send"
          />
        </footer>
      </section>
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 24px;
}

.panel {
  width: min(1200px, 100%);
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  padding: 0;
  box-shadow: 0 10px 25px rgba(17, 24, 39, 0.05);
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 48px);
  overflow: hidden;
}

.sidebar {
  border-right: 1px solid #e5e7eb;
  padding: 16px 14px;
  background: #fafafa;
}

.side-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.side-header h2 {
  margin: 0;
  font-size: 16px;
}

.side-header button {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
}

.history-list {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 8px;
  max-height: calc(100vh - 160px);
  overflow: auto;
}

.history-list li {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  gap: 4px;
}

.history-title {
  color: #1f2937;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  color: #6b7280;
  font-size: 12px;
}

.history-empty {
  margin-top: 14px;
  color: #6b7280;
  font-size: 14px;
}

.chat-area {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-top {
  padding: 16px 18px 12px;
  border-bottom: 1px solid #e5e7eb;
  display: grid;
  gap: 10px;
}

.chat-top h1 {
  margin: 0;
}

.chat-top p {
  margin: 6px 0 0;
  color: #4b5563;
}

.messages {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px 18px;
  display: grid;
  gap: 12px;
}

.empty {
  margin: 0;
  color: #6b7280;
}

.chat-bottom {
  border-top: 1px solid #e5e7eb;
  padding: 12px 18px 16px;
  background: #fff;
}

.loading-tip {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 920px) {
  .home {
    padding: 12px;
  }

  .panel {
    grid-template-columns: 1fr;
    min-height: calc(100vh - 24px);
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .history-list {
    max-height: 200px;
  }
}
</style>
