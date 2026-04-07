<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">大屏案例库</h1>
      <p class="text-gray-300 mb-8">浏览您创建的3D/2D大屏案例，或创建新作品</p>
      
      <!-- 创建新模型按钮 -->
      <div class="mb-6 flex items-center gap-4">
        <router-link 
          to="/editor" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          新建 3D 大屏
        </router-link>
        <router-link 
          to="/select-screen" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2003/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          新建 2D 大屏
        </router-link>
      </div>

      <!-- 过滤切换 -->
      <div class="mb-6 flex items-center justify-between">
        <div class="space-x-2">
          <button
            @click="filterType = undefined; loadData()"
            :class="['px-3 py-1 rounded transition-colors', !filterType ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']"
          >全部</button>
          <button
            @click="filterType = '3d'; loadData()"
            :class="['px-3 py-1 rounded transition-colors', filterType === '3d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']"
          >3D 大屏</button>
          <button
            @click="filterType = '2d'; loadData()"
            :class="['px-3 py-1 rounded transition-colors', filterType === '2d' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']"
          >2D 大屏</button>
        </div>
        <span v-if="auth.user?.nickname" class="text-sm text-gray-300">当前用户：{{ auth.user.nickname }}</span>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-400">加载案例列表...</p>
      </div>

      <!-- 案例列表 -->
      <template v-else>
      <div v-if="displayCases.length === 0" class="text-center py-20">
        <p class="text-xl text-gray-400">{{ filterType ? `暂无 ${filterType === '3d' ? '3D' : '2D'} 案例，快来创建吧！` : '暂无案例，快来创建第一个大屏吧！' }}</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="caseItem in displayCases" 
          :key="caseItem._id"
          class="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-filter backdrop-blur-sm border border-gray-700"
        >
          <div class="h-48 bg-gray-700 relative overflow-hidden">
            <!-- 预览图 -->
            <img 
              :src="caseItem.thumbnail || '/placeholder-3d.svg'" 
              alt="模型预览" 
              class="w-full h-full object-cover"
            >
            <!-- 类型标签 -->
            <span 
              class="absolute top-3 left-3 px-2 py-0.5 text-xs font-medium rounded-full"
              :class="caseItem.type === '3d' ? 'bg-blue-500/80 text-white' : 'bg-emerald-500/80 text-white'"
            >{{ caseItem.type === '3d' ? '3D' : '2D' }}</span>
            
            <!-- 操作按钮 -->
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <router-link 
                :to="`/case/${caseItem._id}/${caseItem.type === '2d' ? 'view' : 'edit'}`" 
                class="mx-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                {{ caseItem.type === '3d' ? '编辑' : '查看' }}
              </router-link>
              <router-link 
                :to="`/case/${caseItem._id}/view`" 
                class="mx-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                预览
              </router-link>
              <button 
                @click="deleteCaseItem(caseItem._id)"
                class="mx-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                删除
              </button>
            </div>
          </div>
          
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">{{ caseItem.name }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ caseItem.description || '暂无描述' }}</p>
            <p v-if="caseItem.ownerName" class="text-xs text-gray-500 mb-2">作者：{{ caseItem.ownerName }}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">更新于 {{ formatDate(caseItem.meta?.updatedAt || caseItem.meta?.createdAt) }}</span>
              <button 
                @click="shareCase(caseItem._id)" 
                class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l-4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useCasesStore } from '../stores/cases'
import { useAuthStore } from '../stores/auth'

const casesStore = useCasesStore()
const auth = useAuthStore()

const loading = computed(() => casesStore.loading)
const displayCases = computed(() => casesStore.cases)
const filterType = ref<'3d' | '2d' | undefined>(undefined)

/** 从服务端加载案例 */
const loadData = () => {
  casesStore.fetchCases(1, filterType.value)
}

onMounted(() => {
  loadData()
})

const formatDate = (timestamp?: number) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleDateString()
}

const shareCase = (caseId: string) => {
  const shareUrl = `${window.location.origin}/case/${caseId}/view`
  navigator.clipboard.writeText(shareUrl)
    .then(() => alert('分享链接已复制到剪贴板！'))
    .catch(() => alert(`分享链接: ${shareUrl}`))
}

const deleteCaseItem = async (caseId: string) => {
  if (!confirm('确定要删除该案例吗？此操作不可恢复。')) return
  try {
    await casesStore.deleteCase(caseId)
  } catch (err: any) {
    alert(err.message || '删除失败，请稍后重试')
  }
}
</script>