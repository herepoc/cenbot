<template>
  <div class="flex justify-end">
    <!-- Conteúdo da mensagem -->
    <div class="max-w-[80%] p-4 rounded-lg bg-primary/10">
      <p class="text-gray-800 whitespace-pre-wrap">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()</script>
