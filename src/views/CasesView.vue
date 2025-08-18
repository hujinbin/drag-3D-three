<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">3D模型案例库</h1>
      <p class="text-gray-300 mb-8">浏览社区创建的3D模型，或创建并分享您自己的作品</p>
      
      <!-- 创建新模型按钮 -->
      <div class="mb-10">
        <router-link 
          to="/editor" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          创建新模型
        </router-link>
      </div>
      
      <!-- 案例列表 -->
      <div v-if="cases.length === 0" class="text-center py-20">
        <p class="text-xl text-gray-400">暂无案例，快来创建第一个模型吧！</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="caseItem in cases" 
          :key="caseItem.id"
          class="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-filter backdrop-blur-sm border border-gray-700"
        >
          <div class="h-48 bg-gray-700 relative overflow-hidden">
            <!-- 预览图 -->
            <img 
              :src="caseItem.thumbnail || '/placeholder-3d.svg'" 
              alt="模型预览" 
              class="w-full h-full object-cover"
            >
            
            <!-- 编辑/查看按钮 -->
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <router-link 
                :to="`/case/${caseItem.id}/edit`" 
                class="mx-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                编辑
              </router-link>
              <router-link 
                :to="`/case/${caseItem.id}/view`" 
                class="mx-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                查看
              </router-link>
            </div>
          </div>
          
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">{{ caseItem.name }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ caseItem.description || '暂无描述' }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">创建于 {{ formatDate(caseItem.createdAt) }}</span>
              <button 
                @click="shareCase(caseItem.id)" 
                class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useCasesStore } from '../stores/cases'

// 使用案例存储
const casesStore = useCasesStore()
const cases = ref(casesStore.getAllCases())

// 在组件挂载时加载案例
onMounted(() => {
  cases.value = casesStore.getAllCases()
})

// 格式化日期
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

// 分享案例
const shareCase = (caseId: string) => {
  const shareUrl = `${window.location.origin}/case/${caseId}/view`
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      alert('分享链接已复制到剪贴板！')
    })
    .catch(err => {
      console.error('无法复制链接:', err)
      alert(`分享链接: ${shareUrl}`)
    })
}
</script>