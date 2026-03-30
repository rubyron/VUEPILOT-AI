<script setup lang="ts">
const props = defineProps<{
  copied: boolean
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <div class="actions">
    <button type="button" @click="emit('copy')">
      {{ props.copied ? '已复制' : '复制' }}
    </button>
  </div>
</template>

<style scoped>
.actions {
  margin-top: 8px;
}

button {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
