<template>
  <div class="w-80 bg-white p-4 shadow-lg h-full overflow-y-auto">
    <h3 class="text-lg font-semibold mb-4">元素属性</h3>

    <div v-if="!element" class="text-gray-500 italic">
      请选择一个元素以编辑其属性
    </div>

    <div v-else class="space-y-4">
      <!-- 基本信息 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">名称</label>
        <input
          type="text"
          v-model="localElement.name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>

      <!-- 位置控制 -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">位置</h4>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-xs text-gray-500">X</label>
            <input
              type="number"
              v-model.number="localElement.position.x"
              step="0.1"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
          <div>
            <label class="block text-xs text-gray-500">Y</label>
            <input
              type="number"
              v-model.number="localElement.position.y"
              step="0.1"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
          <div>
            <label class="block text-xs text-gray-500">Z</label>
            <input
              type="number"
              v-model.number="localElement.position.z"
              step="0.1"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
        </div>
      </div>

      <!-- 尺寸控制 - 根据形状动态显示 -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">尺寸</h4>

        <!-- 立方体: 宽/高/深 -->
        <template v-if="element.type === 'cube'">
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-xs text-gray-500">宽度</label>
              <input type="number" v-model.number="localElement.size.width" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">高度</label>
              <input type="number" v-model.number="localElement.size.height" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">深度</label>
              <input type="number" v-model.number="localElement.size.depth" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        </template>

        <!-- 球体: 半径 -->
        <div v-if="element.type === 'sphere'" class="space-y-1">
          <label class="block text-xs text-gray-500">半径</label>
          <input type="number" v-model.number="localElement.size.radius" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
        </div>

        <!-- 圆柱体: 高度 + 半径 -->
        <template v-if="element.type === 'cylinder'">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-500">高度</label>
              <input type="number" v-model.number="localElement.size.height" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">半径</label>
              <input type="number" v-model.number="localElement.size.radius" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        </template>

        <!-- 金字塔: 高度 + 半径 -->
        <template v-if="element.type === 'pyramid'">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-500">高度</label>
              <input type="number" v-model.number="localElement.size.height" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">半径</label>
              <input type="number" v-model.number="localElement.size.radius" min="0.1" step="0.1" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        </template>

        <!-- 自定义模型: 宽/高/深 -->
        <template v-if="element.type === 'custom'">
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-xs text-gray-500">宽度</label>
              <input type="number" v-model.number="localElement.size.width" min="0.1" step="0.5" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">高度</label>
              <input type="number" v-model.number="localElement.size.height" min="0.1" step="0.5" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">深度</label>
              <input type="number" v-model.number="localElement.size.depth" min="0.1" step="0.5" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        </template>
      </div>

      <!-- 颜色选择（非自定义模型时显示） -->
      <div v-if="element.type !== 'custom'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">颜色</label>
        <div class="flex items-center">
          <input
            type="color"
            v-model="localElement.color"
            class="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          >
          <input
            type="text"
            v-model="localElement.color"
            class="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
      </div>

      <!-- 数字标签 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">显示数字标签</label>
        <input
          type="text"
          v-model="localElement.number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="输入要显示的编号文字（可选）"
        >
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-2 pt-4 border-t border-gray-200">
        <button
          @click="resetElement"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          重置
        </button>
        <button
          @click="deleteElement"
          class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'

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
  element: Element
}>()

const emits = defineEmits<{
  (event: 'update-element', element: Element): void
  (event: 'delete-element', elementId: string): void
}>()

// 响应式副本用于双向绑定
const localElement = reactive<Element>({ ...props.element })

watch(() => props.element, (newEl) => {
  Object.assign(localElement, newEl)
}, { deep: true })

watch(localElement, (updated) => {
  emits('update-element', { ...updated } as Element)
}, { deep: true })

const resetElement = () => {
  Object.assign(localElement, props.element)
}

const deleteElement = () => {
  emits('delete-element', localElement.id)
}
</script>
