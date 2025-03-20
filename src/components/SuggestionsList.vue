<template>
  <div v-if="suggestions.length > 0" class="bg-white/30 backdrop-blur-md border-t border-gray-200">
    <div class="max-w-5xl mx-auto p-4 flex flex-wrap gap-2">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        @click="handleSuggestionClick(suggestion)"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
const { suggestedMessages } = storeToRefs(chatStore)
const { sendMessage } = chatStore

const suggestions = computed(() => suggestedMessages.value)

function handleSuggestionClick(suggestion: string) {
  sendMessage(suggestion)
}
</script>
