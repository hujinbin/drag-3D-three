<template>
  <div class="h-screen w-screen bg-gray-900 flex flex-col">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← 返回
        </button>
        <h1 class="text-xl font-bold text-white">{{ templateName }}</h1>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="resetCamera"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          重置视角
        </button>
        <button
          @click="toggleFullscreen"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          全屏
        </button>
      </div>
    </div>

    <!-- 3D 画布 -->
    <div class="flex-1 relative">
      <ThreeDWorkspace 
        :elements="elements"
        @element-selected="handleElementSelected"
        @element-created="handleElementCreated"
      />
      
      <!-- 元素信息面板 -->
      <div
        v-if="selectedElement"
        class="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 w-64"
      >
        <h3 class="font-bold text-gray-800 mb-2">元素信息</h3>
        <div class="space-y-2 text-sm">
          <div>
            <span class="text-gray-600">名称:</span>
            <span class="ml-2 font-semibold">{{ selectedElement.name }}</span>
          </div>
          <div>
            <span class="text-gray-600">类型:</span>
            <span class="ml-2 font-semibold">{{ selectedElement.type }}</span>
          </div>
          <div>
            <span class="text-gray-600">编号:</span>
            <span class="ml-2 font-semibold">{{ selectedElement.number }}</span>
          </div>
          <div>
            <span class="text-gray-600">位置:</span>
            <span class="ml-2 text-xs">
              X: {{ selectedElement.position.x.toFixed(1) }},
              Y: {{ selectedElement.position.y.toFixed(1) }},
              Z: {{ selectedElement.position.z.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white rounded-lg p-4">
        <div class="text-sm space-y-1">
          <div>元素总数: {{ elements.length }}</div>
          <div>立方体: {{ countByType('cube') }}</div>
          <div>球体: {{ countByType('sphere') }}</div>
          <div>圆柱体: {{ countByType('cylinder') }}</div>
          <div>金字塔: {{ countByType('pyramid') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplatesStore } from '../stores/templates'
import ThreeDWorkspace from '../components/ThreeDWorkspace.vue'

interface Element {
  id: string
  name: string
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid'
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string
  number: string
}

const route = useRoute()
const router = useRouter()
const templatesStore = useTemplatesStore()

const elements = ref<Element[]>([])
const selectedElementId = ref<string | null>(null)
const templateName = ref('3D 大屏')

const selectedElement = computed(() => {
  if (!selectedElementId.value) return null
  return elements.value.find(el => el.id === selectedElementId.value)
})

onMounted(() => {
  const templateId = route.params.templateId as string
  if (templateId) {
    const template = templatesStore.getTemplateById('3d', templateId)
    if (template) {
      templateName.value = template.name
      if (template.data?.elements) {
        elements.value = template.data.elements
      }
    }
  }
})

const goBack = () => {
  router.push({ name: 'select-screen' })
}

const resetCamera = () => {
  // 通过事件或ref重置相机位置
  window.location.reload()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleElementSelected = (elementId: string) => {
  selectedElementId.value = elementId
}

const handleElementCreated = (element: Element) => {
  elements.value.push(element)
}

const countByType = (type: string) => {
  return elements.value.filter(el => el.type === type).length
}
</script>
