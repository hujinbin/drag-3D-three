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
          v-model="element.name" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
              v-model.number="element.position.x" 
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
          <div>
            <label class="block text-xs text-gray-500">Y</label>
            <input 
              type="number" 
              v-model.number="element.position.y" 
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
          <div>
            <label class="block text-xs text-gray-500">Z</label>
            <input 
              type="number" 
              v-model.number="element.position.z" 
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
        </div>
      </div>
      
      <!-- 尺寸控制 -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">尺寸</h4>
        <div v-if="element.type === 'cube' || element.type === 'cylinder' || element.type === 'pyramid'" class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-xs text-gray-500">宽度</label>
            <input 
              type="number" 
              v-model.number="element.size.width" 
              min="0.1" 
              step="0.1"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
          <div v-if="element.type === 'cube' || element.type === 'cylinder' || element.type === 'pyramid'">
            <label class="block text-xs text-gray-500">高度</label>
            <input 
              type="number" 
              v-model.number="element.size.height" 
              min="0.1" 
              step="0.1"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
          <div v-if="element.type === 'cube'">
            <label class="block text-xs text-gray-500">深度</label>
            <input 
              type="number" 
              v-model.number="element.size.depth" 
              min="0.1" 
              step="0.1"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            >
          </div>
        </div>
        <div v-if="element.type === 'sphere'" class="space-y-1">
          <label class="block text-xs text-gray-500">半径</label>
          <input 
            type="number" 
            v-model.number="element.size.radius" 
            min="0.1" 
            step="0.1"
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
          >
        </div>
      </div>
      
      <!-- 颜色选择 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">颜色</label>
        <div class="flex items-center">
          <input 
            type="color" 
            v-model="element.color" 
            class="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          >
          <input 
            type="text" 
            v-model="element.color" 
            class="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
        </div>
      </div>
      
      <!-- 数字标签 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">显示数字</label>
        <input 
          type="text" 
          v-model="element.number" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="输入要显示的数字"
        >
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex space-x-2 pt-4 border-t">
        <button 
          @click="resetElement" 
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重置
        </button>
        <button 
          @click="deleteElement" 
          class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'

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
  element: Element
}>()

const emits = defineEmits<{
  (event: 'update-element', element: Element): void
  (event: 'delete-element', elementId: string): void
}>()

// 创建响应式副本
const elementData = reactive<Element>({...props.element})

// 监听原始属性变化，更新副本
watch(() => props.element, (newElement) => {
  Object.assign(elementData, newElement)
}, { deep: true })

// 监听副本变化，触发更新事件
watch(elementData, (updatedElement) => {
  emits('update-element', {...updatedElement})
}, { deep: true })

// 重置元素属性
const resetElement = () => {
  Object.assign(elementData, props.element)
}

// 删除元素
const deleteElement = () => {
  emits('delete-element', elementData.id)
}
</script>