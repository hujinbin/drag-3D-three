<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div class="flex items-center space-x-4">
        <router-link 
          to="/cases" 
          class="text-gray-300 hover:text-white transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold">{{ caseData?.name || '加载中...' }}</h1>
        <span 
          :class="{
            'bg-indigo-600': mode === 'edit',
            'bg-green-600': mode === 'view'
          }"
          class="px-2 py-1 text-xs rounded-full"
        >
          {{ mode === 'edit' ? '编辑模式' : '查看模式' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-3">
        <template v-if="mode === 'edit'">
          <input 
            v-model="caseName" 
            class="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
            placeholder="输入模型名称"
          >
          <button 
            @click="saveCase" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
          >
            保存
          </button>
        </template>
        
        <template v-else>
          <button 
            @click="switchToEditMode" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
          >
            编辑此模型
          </button>
        </template>
        
        <button 
          @click="shareCase" 
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享
        </button>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧工具栏 (仅编辑模式) -->
      <ElementToolbar v-if="mode === 'edit'" class="w-64 border-r border-gray-200" />
      
      <!-- 中央工作区 -->
      <ThreeDWorkspace 
        class="flex-1" 
        :elements="elements"
        :readonly="mode === 'view'"
        @element-selected="selectElement"
        @element-created="addElement"
        @update-element="updateElement"
      />
      
      <!-- 右侧属性面板 (仅编辑模式) -->
      <ElementProperties 
        v-if="selectedElement && mode === 'edit'" 
        :element="selectedElement" 
        @update-element="updateElement"
        @delete-element="deleteElement"
        class="w-80 border-l border-gray-200"
      />
    </div>
    
    <!-- 分享对话框 -->
    <div v-if="showShareDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">分享此3D模型</h3>
        <p class="mb-4 text-gray-600">复制以下链接分享给他人：</p>
        
        <div class="flex mb-4">
          <input 
            ref="shareUrlInput"
            type="text" 
            :value="shareUrl" 
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
          <button 
            @click="copyShareUrl" 
            class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            复制
          </button>
        </div>
        
        <div class="flex justify-end">
          <button 
            @click="showShareDialog = false" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ElementToolbar from '../components/ElementToolbar.vue'
import ThreeDWorkspace from '../components/ThreeDWorkspace.vue'
import ElementProperties from '../components/ElementProperties.vue'
import { useCasesStore } from '../stores/cases'

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

const props = defineProps<{
  id: string
  mode: 'edit' | 'view'
}>()

const route = useRoute()
const router = useRouter()
const casesStore = useCasesStore()

const elements = ref<Element[]>([])
const selectedElement = ref<Element | null>(null)
const caseName = ref('')
const caseData = ref<any>(null)
const showShareDialog = ref(false)
const shareUrlInput = ref<HTMLInputElement | null>(null)

// 计算分享URL
const shareUrl = computed(() => {
  if (!caseData.value) return ''
  // 使用绝对URL，确保可以直接复制使用
  const baseUrl = window.location.origin
  return `${baseUrl}/case/${caseData.value.id}/view`
})

// 加载案例数据
const loadCaseData = () => {
  const caseId = props.id
  const loadedCase = casesStore.getCaseById(caseId)
  
  if (loadedCase) {
    caseData.value = loadedCase
    caseName.value = loadedCase.name
    elements.value = [...loadedCase.elements]
  } else {
    // 案例不存在，返回列表页
    router.push('/cases')
  }
}

// 保存案例
const saveCase = () => {
  if (!caseData.value) return
  
  // 更新案例数据
  const updatedCase = casesStore.updateCase({
    ...caseData.value,
    name: caseName.value,
    elements: [...elements.value],
    updatedAt: new Date().toISOString()
  })
  
  caseData.value = updatedCase
}

// 切换到编辑模式
const switchToEditMode = () => {
  router.push(`/case/${props.id}/edit`)
}

// 显示分享对话框
const shareCase = () => {
  showShareDialog.value = true
  // 等待DOM更新后聚焦输入框
  setTimeout(() => {
    if (shareUrlInput.value) {
      shareUrlInput.value.select()
    }
  }, 100)
}

// 复制分享链接
const copyShareUrl = () => {
  if (shareUrlInput.value) {
    shareUrlInput.value.select()
    document.execCommand('copy')
    alert('链接已复制到剪贴板')
  }
}

// 元素操作函数
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

// 监听路由变化，重新加载数据
watch(() => route.params, () => {
  loadCaseData()
})

// 组件挂载时加载数据
onMounted(() => {
  loadCaseData()
})
</script>
