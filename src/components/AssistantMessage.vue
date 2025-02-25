<template>
  <div class="flex items-start gap-4 p-4 rounded-lg bg-gray-100">
    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
      <span class="text-white text-sm">C</span>
    </div>
    <!-- Conteúdo da mensagem -->
    <div class="flex-1">
      <p class="text-gray-800 whitespace-pre-wrap">
        {{ displayedContent }}<span v-if="isTyping" class="animate-pulse">|</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  content: string
}>()

const displayedContent = ref('')
const isTyping = ref(false)
const typingInterval = 100 // ms entre grupos de palavras

function getRandomWordCount() {
  return Math.floor(Math.random() * 5) + 4 // Número aleatório entre 4 e 8
}

async function typeMessage(message: string) {
  isTyping.value = true
  displayedContent.value = ''
  
  const words = message.split(/\s+/)
  let currentIndex = 0
  
  while (currentIndex < words.length) {
    const wordCount = getRandomWordCount()
    const nextWords = words.slice(currentIndex, currentIndex + wordCount)
    
    // Adiciona as palavras com os espaços apropriados
    if (currentIndex === 0) {
      displayedContent.value = nextWords.join(' ')
    } else {
      displayedContent.value += ' ' + nextWords.join(' ')
    }
    
    currentIndex += wordCount
    await new Promise(resolve => setTimeout(resolve, typingInterval))
  }
  
  isTyping.value = false
}

watch(() => props.content, (newContent) => {
  if (newContent) {
    typeMessage(newContent)
  }
}, { immediate: true })
</script>
