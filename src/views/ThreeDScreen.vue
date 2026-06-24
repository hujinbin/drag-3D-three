<template>
  <div class="h-screen w-screen bg-gray-900 flex flex-col">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between z-50">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-1"
        >
          &larr; 返回
        </button>
        <div>
          <h1 class="text-xl font-bold text-white">{{ templateName }}</h1>
          <span v-if="selectedElement" class="text-xs text-indigo-400">已选中: {{ selectedElement.name }}</span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <!-- 模式切换 -->
        <button
          @click="isEditMode = !isEditMode"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors flex items-center',
            isEditMode ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 w-5 mr-2', isEditMode ? '' : 'opacity-60']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          {{ isEditMode ? '完成编辑' : '编辑模式' }}
        </button>
        <button
          @click="resetCamera"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          重置视角
        </button>
        <button
          @click="toggleFullscreen"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >全屏</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 relative overflow-hidden">
      <!-- 3D 工作区 -->
      <ThreeDWorkspace
        ref="workspaceRef"
        :elements="elements"
        :readonly="!isEditMode"
        @element-selected="handleElementSelected"
        @element-created="handleElementCreated"
        @update-element="handleUpdateElement"
      />

      <!-- 统计信息浮层（左下）-->
      <div class="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white rounded-lg p-4 z-30">
        <div class="text-xs font-medium mb-2 opacity-70">场景统计</div>
        <div class="text-sm space-y-1">
          <div>元素总数：<span class="font-bold text-cyan-400">{{ elements.length }}</span></div>
          <div>立方体：<span class="text-blue-300">{{ countByType('cube') }}</span></div>
          <div>球体：<span class="text-green-300">{{ countByType('sphere') }}</span></div>
          <div>圆柱体：<span class="text-yellow-300">{{ countByType('cylinder') }}</span></div>
          <div>自定义：<span class="text-pink-300">{{ countByType('custom') + countByType('pyramid') }}</span></div>
        </div>
      </div>

      <!-- 右侧属性面板（编辑模式+选中元素时显示） -->
      <Transition name="slide-left">
        <div
          v-if="isEditMode && selectedElement"
          class="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-40 overflow-y-auto custom-scroll"
        >
          <div class="p-5">
            <div class="flex items-center justify-between mb-5 pb-3 border-b">
              <h3 class="text-lg font-bold text-gray-800">元素属性</h3>
              <button @click="deselectElement" class="p-1 rounded hover:bg-gray-100 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="space-y-5">
              <!-- 名称 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <input type="text" v-model="editingElement.name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>

              <!-- 位置 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">位置坐标</label>
                <div class="grid grid-cols-3 gap-2">
                  <div><label class="block text-[10px] text-gray-400">X</label><input type="number" v-model.number="editingElement.position.x" step="0.1" class="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"/></div>
                  <div><label class="block text-[10px] text-gray-400">Y</label><input type="number" v-model.number="editingElement.position.y" step="0.1" class="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"/></div>
                  <div><label class="block text-[10px] text-gray-400">Z</label><input type="number" v-model.number="editingElement.position.z" step="0.1" class="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"/></div>
                </div>
              </div>

              <!-- 尺寸 - 根据形状动态显示 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">尺寸</label>
                <template v-if="editingElement.type === 'cube' || editingElement.type === 'custom'">
                  <div class="grid grid-cols-3 gap-2">
                    <div><label class="block text-[10px] text-gray-400">宽</label><input type="number" v-model.number="editingElement.size.width" min="0.1" step="0.5" class="w-full px-2 py-1.5 text-sm border rounded"/></div>
                    <div><label class="block text-[10px] text-gray-400">高</label><input type="number" v-model.number="editingElement.size.height" min="0.1" step="0.5" class="w-full px-2 py-1.5 text-sm border rounded"/></div>
                    <div><label class="block text-[10px] text-gray-400">深</label><input type="number" v-model.number="editingElement.size.depth" min="0.1" step="0.5" class="w-full px-2 py-1.5 text-sm border rounded"/></div>
                  </div>
                </template>
                <template v-else-if="editingElement.type === 'sphere'">
                  <div><label class="block text-[10px] text-gray-400">半径</label><input type="number" v-model.number="editingElement.size.radius" min="0.1" step="0.5" class="w-full px-3 py-1.5 text-sm border rounded mt-1"/></div>
                </template>
                <template v-else>
                  <div class="grid grid-cols-2 gap-2">
                    <div><label class="block text-[10px] text-gray-400">高度</label><input type="number" v-model.number="editingElement.size.height" min="0.1" step="0.5" class="w-full px-2 py-1.5 text-sm border rounded"/></div>
                    <div><label class="block text-[10px] text-gray-400">半径</label><input type="number" v-model.number="editingElement.size.radius" min="0.1" step="0.5" class="w-full px-2 py-1.5 text-sm border rounded"/></div>
                  </div>
                </template>
              </div>

              <!-- 颜色（非自定义模型） -->
              <div v-if="editingElement.type !== 'custom'">
                <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                <div class="flex items-center gap-2">
                  <input type="color" v-model="editingElement.color" class="w-10 h-10 rounded cursor-pointer border-0" />
                  <input type="text" v-model="editingElement.color" class="flex-1 px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <!-- 数字标签 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">数字标签</label>
                <input type="text" v-model="editingElement.number" placeholder="可选，在元素上方显示文字"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-3 pt-3 border-t">
                <button @click="resetEditingElement" class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition">重置</button>
                <button @click="deleteSelectedElement" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition">删除元素</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplatesStore } from '../stores/templates'
import ThreeDWorkspace from '../components/ThreeDWorkspace.vue'

interface Element {
  id: string; name: string; type: 'cube' | 'sphere' | 'cylinder' | 'pyramid' | 'custom'
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string; number: string; modelUrl?: string
}

const route = useRoute()
const router = useRouter()
const templatesStore = useTemplatesStore()

const elements = ref<Element[]>([])
const selectedElementId = ref<string | null>(null)
const templateName = ref('3D 大屏')
const isEditMode = ref(false)
const workspaceRef = ref<InstanceType<typeof ThreeDWorkspace> | null>(null)

const selectedElement = computed(() => {
  if (!selectedElementId.value) return null
  return elements.value.find(el => el.id === selectedElementId.value)
})

// 响应式编辑数据（深拷贝）
const editingElement = ref<any>({})

// 同步 editingElement 到选中元素
function syncEditingElement() {
  const el = selectedElement.value
  if (!el) return
  editingElement.value = JSON.parse(JSON.stringify(el))
}

// 监听选中变化
watch(selectedElementId, () => {
  syncEditingElement()
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

const goBack = () => router.push({ name: 'select-screen' })

const resetCamera = () => window.location.reload()
const toggleFullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()

const handleElementSelected = (elementId: string) => {
  selectedElementId.value = elementId
}
const deselectElement = () => { selectedElementId.value = null }

const handleElementCreated = (el: Element) => {
  elements.value.push(el)
  // 新建后自动选中
  selectedElementId.value = el.id
}

const handleUpdateElement = (updatedEl: Element) => {
  const idx = elements.value.findIndex(e => e.id === updatedEl.id)
  if (idx !== -1) {
    elements.value[idx] = updatedEl
    // 如果正在编辑该元素，同步更新编辑面板
    if (selectedElementId.value === updatedEl.id) {
      editingElement.value = JSON.parse(JSON.stringify(updatedEl))
    }
  }
}

const countByType = (type: string) =>
  elements.value.filter(el => el.type === type).length

const resetEditingElement = () => {
  syncEditingElement()
}

const deleteSelectedElement = () => {
  if (!selectedElementId.value) return
  elements.value = elements.value.filter(e => e.id !== selectedElementId.value)
  selectedElementId.value = null
}

import { watch } from 'vue'
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-left-enter-from,
.slide-left-leave-to { transform: translateX(100%); opacity: 0; }

.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
