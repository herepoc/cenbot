<template>
  <div class="flex items-start gap-3 bg-white/30 backdrop-blur-sm p-4 rounded-lg">
    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    </div>
    <div class="flex-1 prose prose-sm max-w-none prose-spacing" v-html="formattedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatMessage } from '@/utils/formatMessage'

const props = defineProps<{
  content: string
}>()

const formattedContent = computed(() => formatMessage(props.content))
</script>

<style>
.prose {
  @apply text-gray-700;
}

.prose-spacing p {
  @apply my-4 leading-relaxed;
}

.prose-spacing p:first-child {
  @apply mt-1;
}

.prose-spacing h1, 
.prose-spacing h2, 
.prose-spacing h3, 
.prose-spacing h4, 
.prose-spacing h5, 
.prose-spacing h6 {
  @apply mt-6 mb-4 font-medium;
}

.prose a {
  @apply text-primary hover:text-primary-dark transition-colors;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}

.prose code {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm;
}

.prose pre code {
  @apply bg-transparent p-0;
}

.prose ul {
  @apply list-disc;
}

.prose ol {
  @apply list-decimal;
}

.prose li {
  @apply pl-1 pb-1;
}

.prose li > ul,
.prose li > ol {
  @apply mt-3 ml-4;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic my-4;
}

.prose hr {
  @apply my-6 border-gray-200;
}

.prose img {
  @apply max-w-[350px] my-2 rounded-lg;
}

/* Adiciona espaçamento entre grupos de elementos */
.prose-spacing > * + *:not(li) {
  @apply mt-4;
}
</style>
