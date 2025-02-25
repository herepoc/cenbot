<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
    <div class="container mx-auto">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-1 p-4">
        <div class="flex gap-2">
          <textarea
            ref="textarea"
            v-model="input"
            placeholder="Digite sua mensagem..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            :class="{ 'cursor-not-allowed': isLoading }"
            :disabled="isLoading"
            rows="1"
            maxlength="150"
            @keydown="handleKeyDown"
          ></textarea>
          <button
            type="submit"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || !input.trim()">
            Enviar
          </button>
        </div>
        <div v-if="input.length > 100" class="flex justify-end">
          <span class="text-sm" :class="input.length > 140 ? 'text-red-500' : 'text-gray-500'">
            {{ input.length }}/150 caracteres
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const { textarea, input } = useTextareaAutosize({
  styleProp: 'minHeight',
})

function handleKeyDown(e: KeyboardEvent) {
  // Se Enter foi pressionado sem modificadores, envia a mensagem
  if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    handleSubmit()
  }
}

function handleSubmit() {
  if (!input.value.trim() || props.isLoading) return
  
  emit('send', input.value)
  input.value = ''
}
</script>

<style scoped>
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}
</style>
