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
          {{ caseData?.type === '2d' ? '2D大屏' : '3D大屏' }} · {{ mode === 'edit' ? '编辑模式' : '查看模式' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-3">
        <template v-if="mode === 'edit'">
          <input 
            v-model="caseName" 
            class="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
            placeholder="输入名称"
          >
          <button 
            @click="saveCase" 
            :disabled="saving"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors duration-200"
          >
            {{ saving ? '保存中...' : '保存' }}
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
          @click="showShareDialog = true" 
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
      <!-- 左侧工具栏 (仅编辑模式 + 3D类型) -->
      <ElementToolbar v-if="mode === 'edit' && caseData?.type !== '2d'" class="w-64 border-r border-gray-200" />
      
      <!-- 中央工作区 -->
      <ThreeDWorkspace 
        v-if="!caseData || caseData.type !== '2d'"
        class="flex-1" 
        :elements="elements"
        :readonly="mode === 'view'"
        @element-selected="selectElement"
        @element-created="addElement"
        @update-element="updateElement"
      />
      
      <!-- 2D 图表展示占位（后续可对接 EChartsScreen） -->
      <div v-else class="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
        <div class="text-center">
          <div class="text-6xl mb-4">📊</div>
          <p class="text-xl">2D 大屏预览</p>
          <p class="text-sm mt-2">包含 {{ caseData.charts?.length || 0 }} 个图表组件</p>
        </div>
      </div>
      
      <!-- 右侧属性面板 (仅编辑模式 + 3D) -->
      <ElementProperties 
        v-if="selectedElement && mode === 'edit' && caseData?.type !== '2d'"
        :element="selectedElement" 
        @update-element="updateElement"
        @delete-element="deleteElement"
        class="w-80 border-l border-gray-200"
      />
    </div>
    
    <!-- 分享对话框 -->
    <div v-if="showShareDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">分享此{{ caseData?.type === '2d' ? '2D' : '3D' }}大屏</h3>
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
const saving = ref(false)
const loading = ref(true)

const shareUrl = computed(() => {
  if (!caseData.value) return ''
  return `${window.location.origin}/case/${caseData.value._id}/view`
})

/** 从服务端加载案例详情 */
const loadCaseData = async () => {
  const caseId = props.id
  loading.value = true

  // 优先从本地 store 查找（避免重复请求）
  let loadedCase = casesStore.getCaseById(caseId)
  if (!loadedCase) {
    // 本地没有，调接口获取详情
    loadedCase = await casesStore.fetchCaseDetail(caseId)
  }

  if (loadedCase) {
    caseData.value = loadedCase
    caseName.value = loadedCase.name
    // 2D 案例在编辑模式下跳转到 2D 大屏编辑器
    if (loadedCase.type === '2d' && props.mode === 'edit') {
      router.push(`/2d-screen?caseId=${loadedCase._id}`)
      return
    }
    // 兼容新旧数据结构：优先使用 elements，兼容旧 id 字段
    if (loadedCase.elements && Array.isArray(loadedCase.elements)) {
      elements.value = [...loadedCase.elements]
    } else {
      elements.value = []
    }
  } else {
    router.push('/cases')
  }
  loading.value = false
}

const saveCase = async () => {
  if (!caseData.value) return

  saving.value = true
  try {
    await casesStore.updateCase({
      id: caseData.value._id,
      name: caseName.value,
      elements: [...elements.value],
    })
    // 更新本地引用
    caseData.value = { ...caseData.value, name: caseName.value }
  } catch (err: any) {
    alert(err.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const switchToEditMode = () => {
  if (caseData.value?.type === '2d') {
    router.push(`/2d-screen?caseId=${props.id}`)
  } else {
    router.push(`/case/${props.id}/edit`)
  }
}

const copyShareUrl = () => {
  if (shareUrlInput.value) {
    shareUrlInput.value.select()
    document.execCommand('copy')
    alert('链接已复制到剪贴板')
  }
}

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

watch(() => route.params, () => { loadCaseData() })
onMounted(() => { loadCaseData() })
</script>