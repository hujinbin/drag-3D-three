<template>
  <div class="min-h-screen">
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold">3D编辑器</router-link>
        <div class="space-x-4">
          <router-link to="/" class="hover:text-blue-300">首页</router-link>
          <router-link to="/editor" class="hover:text-blue-300">编辑器</router-link>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
// App.vue 现在只作为路由容器
</script>