<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div class="flex items-center space-x-4">
        <router-link 
          to="/" 
          class="text-gray-300 hover:text-white transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold">3D模型编辑器</h1>
      </div>
      
      <div class="flex items-center space-x-3">
        <input 
          v-model="modelName" 
          class="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
          placeholder="输入模型名称"
        >
        <button 
          @click="saveModel" 
          :disabled="elements.length === 0"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
        >
          保存模型
        </button>
        <router-link 
          to="/cases" 
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
        >
          查看案例
        </router-link>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧工具栏 -->
      <ElementToolbar class="w-64 border-r border-gray-200" />
      
      <!-- 中央工作区 -->
      <ThreeDWorkspace 
        class="flex-1" 
        :elements="elements"
        @element-selected="selectElement"
        @element-created="addElement"
        @update-element="updateElement"
      />
      
      <!-- 右侧属性面板 -->
      <ElementProperties 
        v-if="selectedElement" 
        :element="selectedElement" 
        @update-element="updateElement"
        @delete-element="deleteElement"
        class="w-80 border-l border-gray-200"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ElementToolbar from '../components/ElementToolbar.vue'
import ThreeDWorkspace from '../components/ThreeDWorkspace.vue'
import ElementProperties from '../components/ElementProperties.vue'
import { useCasesStore } from '../stores/cases'
import { useAuthStore } from '../stores/auth'

// 定义元素接口
interface Element {
  id: string
  name: string
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid' | 'custom'
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string
  number: string
  modelUrl?: string
}

const router = useRouter()
const casesStore = useCasesStore()
const auth = useAuthStore()

const elements = ref<Element[]>([])
const selectedElement = ref<Element | null>(null)
const modelName = ref('未命名模型')

const addElement = (element: Element) => {
  elements.value.push(element)
}

const selectElement = (elementId: string) => {
  selectedElement.value = elements.value.find(el => el.id === elementId) || null
}

const updateElement = (updatedElement: Element) => {
  const index = elements.value.findIndex(el => el.id === updatedElement.id)
  if (index !== -1) {
    elements.value[index] = updatedElement
  }
}

const deleteElement = (elementId: string) => {
  elements.value = elements.value.filter(el => el.id !== elementId)
  if (selectedElement.value?.id === elementId) {
    selectedElement.value = null
  }
}

// 保存模型为案例
const saveModel = () => {
  if (elements.value.length === 0) {
    alert('请先创建至少一个元素！')
    return
  }
  
  // 创建新案例
  const newCase = casesStore.createCase(
    modelName.value,
    [...elements.value],
    { ownerName: auth.user?.username, ownerId: auth.user?.id }
  )
  
  // 跳转到案例详情页面
  router.push(`/case/${newCase.id}/edit`)
}
</script>
