<template>
  <div class="min-h-screen" style="background-image: url('/back.jpg'); background-size: 200px; background-repeat: repeat;">
    <header class="bg-white shadow-md p-4 flex justify-center items-center">
      <div class="h-12 flex items-center">
        <img src="/logo.jpg" alt="Logo" class="h-full object-contain mt-2" />
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// Componente principal
</script>