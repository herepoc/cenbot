<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
    <div class="container mx-auto">
      <form @submit.prevent="handleSubmit" class="flex gap-2 p-4">
        <textarea
          v-model="message"
          placeholder="Digite sua mensagem..."
          class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          :class="{ 'cursor-not-allowed': isLoading }"
          :disabled="isLoading"
          :style="{ height: textareaHeight + 'px' }"
          rows="1"
          @input="adjustHeight"
          @keydown="handleKeyDown"
          ref="textareaRef"
        ></textarea>
        <button
          type="submit"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading || !message.trim()">
          Enviar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const textareaHeight = ref(40) // altura inicial
const lineHeight = 20 // altura aproximada de cada linha em pixels
const maxLines = 4 // máximo de linhas permitidas

function adjustHeight() {
  if (!textareaRef.value) return

  // Reset height para calcular corretamente
  textareaRef.value.style.height = 'auto'
  
  // Calcula a nova altura
  const newHeight = Math.min(
    textareaRef.value.scrollHeight,
    lineHeight * maxLines
  )
  
  textareaHeight.value = Math.max(newHeight, lineHeight * 1) // mínimo de 1 linha
}

function handleKeyDown(e: KeyboardEvent) {
  // Se Enter foi pressionado sem modificadores, envia a mensagem
  if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    handleSubmit()
  }
}

function handleSubmit() {
  if (!message.value.trim() || props.isLoading) return
  
  emit('send', message.value)
  message.value = ''
  // Reset altura após envio
  textareaHeight.value = lineHeight * 1
}

onMounted(() => {
  adjustHeight()
})
</script>
