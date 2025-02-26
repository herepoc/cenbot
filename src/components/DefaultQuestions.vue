<template>
  <div class="flex flex-col items-center justify-center h-full gap-6 p-4 bg-white/30 backdrop-blur-sm">
    <h2 class="text-2xl font-semibold text-gray-700 text-center">
      Olá, seja bem vindo!
    </h2>
    <p class="text-center text-gray-600 max-w-2xl mb-2">
      Já trago aqui algumas das perguntas mais frequentemente feitas. Mas sinta-se livre pra perguntar o que quiser sobre Centrum!
    </p>
    <div class="w-full max-w-6xl px-4">
      <div class="flex flex-wrap justify-center gap-4">
        <button
          v-for="question in defaultQuestions"
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
import { defaultQuestions, useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

async function handleQuestionClick(question: string) {
  await chatStore.sendMessage(question)
}
</script>
