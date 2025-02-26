<template>
  <div class="h-screen pt-20">
    <!-- Área de mensagens com fundo blur -->
    <div ref="chatContainer" class="h-[calc(100vh-80px-76px)] overflow-y-auto bg-white/30">
      <div class="max-w-5xl mx-auto h-full">
        <template v-if="messages.length > 0">
          <div class="p-4 space-y-6">
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
            <div id="loading-points" v-if="isLoading" class="flex items-center p-4 bg-gray-200/70 backdrop-blur-sm rounded-lg w-fit">
              <div class="loading-bar"></div>
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

<style scoped>
.rainbow-dot {
  animation: rainbow-bounce 1s infinite alternate, rainbow-color 2s infinite linear;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.loading-bar {
  width: 60px;
  height: 6px;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  animation: pulse 1.5s infinite ease-in-out;
}

.loading-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #ff0000, #ff9900, #ffff00, #00ff00, #0099ff, #6633ff, #ff33cc, #ff0000
  );
  background-size: 200% 100%;
  animation: rainbow-move 2s linear infinite;
}

.loading-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scaleY(1);
    opacity: 1;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 0.8;
  }
}

@keyframes rainbow-move {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

@keyframes rainbow-bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

@keyframes rainbow-color {
  0% {
    background-color: #ff0000; /* Vermelho */
  }
  16.6% {
    background-color: #ff9900; /* Laranja */
  }
  33.3% {
    background-color: #ffff00; /* Amarelo */
  }
  50% {
    background-color: #00ff00; /* Verde */
  }
  66.6% {
    background-color: #0099ff; /* Azul */
  }
  83.3% {
    background-color: #6633ff; /* Índigo */
  }
  100% {
    background-color: #ff33cc; /* Violeta */
  }
}

#loading-points {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>