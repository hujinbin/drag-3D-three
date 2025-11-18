<template>
  <div class="min-h-screen">
    <nav class="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold flex items-center">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-2xl font-extrabold">3D编辑器</span>
        </router-link>
        <div class="flex space-x-6 items-center">
          <router-link 
            to="/" 
            class="nav-link relative px-3 py-2 font-medium" 
            active-class="text-blue-400"
          >
            首页
          </router-link>
          <router-link 
            to="/editor" 
            class="nav-link relative px-3 py-2 font-medium" 
            active-class="text-blue-400"
          >
            编辑器
          </router-link>
          <router-link 
            to="/cases" 
            class="nav-link relative px-3 py-2 font-medium" 
            active-class="text-blue-400"
          >
            案例
          </router-link>
          <router-link 
            to="/settings" 
            class="nav-link relative px-3 py-2 font-medium" 
            active-class="text-blue-400"
          >
            设置
          </router-link>

          <div class="flex items-center space-x-3 pl-4 border-l border-blue-700">
            <span v-if="isAuthed" class="text-sm text-blue-200">{{ username }}</span>
            <router-link v-if="!isAuthed" to="/login" class="nav-link px-3 py-2 font-medium">登录</router-link>
            <button v-if="isAuthed" @click="onLogout" class="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm">退出</button>
          </div>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  auth.initialize()
})

const isAuthed = computed(() => auth.isAuthenticated)
const username = computed(() => auth.user?.username || '未登录')

function onLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: rgba(147, 197, 253, 1); /* blue-300 */
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(to right, rgba(96, 165, 250, 1), rgba(167, 139, 250, 1));
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}
</style>