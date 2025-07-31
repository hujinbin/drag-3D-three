<template>
  <div class="flex h-screen overflow-hidden">
    <!-- 左侧工具栏 -->
    <ElementToolbar />
    
    <!-- 中央工作区 -->
    <ThreeDWorkspace 
      class="flex-1" 
      :elements="elements"
      @element-selected="selectElement"
      @element-created="addElement"
    />
    
    <!-- 右侧属性面板 -->
    <ElementProperties 
      v-if="selectedElement" 
      :element="selectedElement" 
      @update-element="updateElement"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import ElementToolbar from '../components/ElementToolbar.vue'
import ThreeDWorkspace from '../components/ThreeDWorkspace.vue'
import ElementProperties from '../components/ElementProperties.vue'

// 定义元素接口
interface Element {
  id: string
  name: string
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid'
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string
  number: string
}

const elements = ref<Element[]>([])
const selectedElement = ref<Element | null>(null)

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
</script>