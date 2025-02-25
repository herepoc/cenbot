<template>
  <div class="h-screen pt-20">
    <!-- Área de mensagens com fundo blur -->
    <div ref="chatContainer" class="h-[calc(100vh-80px-76px)] overflow-y-auto bg-white/30">
      <div class="max-w-5xl mx-auto h-full">
        <template v-if="messages.length > 0">
          <div class="p-4 space-y-4">
            <template v-for="message in messages" :key="message.id">
              <UserMessage 
                v-if="message.role === 'user'"
                :content="message.content"
              />
              <AssistantMessage
                v-else
                :content="message.content"
              />
            </template>
            <!-- Indicador de digitação -->
            <div v-if="isLoading" class="flex items-center gap-2 p-4">
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </template>
        <div v-else class="h-full flex items-center">
          <DefaultQuestions />
        </div>
      </div>
    </div>

    <!-- Área de sugestões -->
    <div v-if="suggestions.length > 0" class="bg-white/30 backdrop-blur-md border-t border-gray-200">
      <div class="max-w-5xl mx-auto p-4 flex flex-wrap gap-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="sendMessage(suggestion)"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Área de input -->
    <MessageInput 
      :is-loading="isLoading"
      @send="handleSend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import UserMessage from '@/components/UserMessage.vue'
import AssistantMessage from '@/components/AssistantMessage.vue'
import MessageInput from '@/components/MessageInput.vue'
import DefaultQuestions from '@/components/DefaultQuestions.vue'

const chatStore = useChatStore()
const { messages, isLoading, suggestedMessages: suggestions } = storeToRefs(chatStore)
const { sendMessage } = chatStore

const chatContainer = ref<HTMLElement | null>(null)

// Função para enviar mensagem
async function handleSend(message: string) {
  await sendMessage(message)
}

// Scroll automático para a última mensagem
watch([messages, isLoading], async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}, { deep: true })

// Inicialização do chat
onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>