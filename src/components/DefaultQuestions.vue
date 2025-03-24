<template>
  <div class="flex flex-col items-center justify-center h-full gap-6 p-4 bg-white/30 backdrop-blur-sm">
    <p class="text-center text-gray-600 max-w-2xl mb-2">
      {{ configStore.openingStatement }}
    </p>
    <div class="w-full max-w-6xl px-4">
      <div class="flex flex-wrap justify-center gap-4">
        <button
          v-for="question in configStore.defaultQuestions"
          :key="question"
          @click="handleQuestionClick(question)"
          class="min-h-[6rem] w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] p-4 flex items-center justify-center text-center bg-primary/10 backdrop-blur-md hover:bg-primary/20 rounded-lg shadow-sm transition-colors"
        >
          {{ question }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'

const chatStore = useChatStore()
const configStore = useConfigStore()

async function handleQuestionClick(question: string) {
  await chatStore.sendMessage(question)
}
</script>
