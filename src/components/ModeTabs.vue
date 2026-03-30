<script setup lang="ts">
import type { ChatMode } from '../types/chat'
import { getModeLabel } from '../utils/prompts'

const props = defineProps<{
  modelValue: ChatMode
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ChatMode]
}>()

const modes: ChatMode[] = ['qa', 'generate', 'explain', 'copy']
</script>

<template>
  <div class="tabs">
    <button
      v-for="mode in modes"
      :key="mode"
      type="button"
      class="tab"
      :class="{ active: props.modelValue === mode }"
      @click="emit('update:modelValue', mode)"
    >
      {{ getModeLabel(mode) }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  padding: 8px 12px;
  cursor: pointer;
}

.tab.active {
  border-color: #4f46e5;
  background: #eef2ff;
  color: #312e81;
}
</style>
