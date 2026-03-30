<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder: string
  disabled?: boolean
  canSubmit?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()
</script>

<template>
  <div class="chat-input">
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      rows="6"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown.ctrl.enter.prevent="emit('submit')"
    />
    <button type="button" :disabled="disabled || !canSubmit" @click="emit('submit')">发送</button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-input textarea {
  flex: 1;
  min-height: 92px;
}

textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 12px;
  font-family: Consolas, 'Courier New', monospace;
}

button {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
  height: fit-content;
  white-space: nowrap;
}

button:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .chat-input {
    display: grid;
    align-items: stretch;
  }

  .chat-input textarea {
    min-height: 120px;
  }
}
</style>
