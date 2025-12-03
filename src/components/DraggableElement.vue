<template>
  <div 
    class="element-item p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex items-center">
      <div class="w-10 h-10 mr-3 flex items-center justify-center">
        <component :is="elementIcon" class="w-8 h-8 text-gray-700" />
      </div>
      <div>
        <div class="font-medium">{{ elementName }}</div>
        <div class="text-xs text-gray-500">{{ elementDescription }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// 定义组件属性
const props = defineProps<{
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid' | 'custom'
  modelUrl?: string
  name?: string
}>()

// 元素名称映射
const elementNames = {
  cube: '立方体',
  sphere: '球体',
  cylinder: '圆柱体',
  pyramid: '金字塔',
  custom: props.name || '自定义模型'
}

// 元素描述映射
const elementDescriptions = {
  cube: '基础立方体元素',
  sphere: '基础球体元素',
  cylinder: '基础圆柱体元素',
  pyramid: '基础金字塔元素',
  custom: '导入的3D模型'
}

// 元素图标组件
const elementIcon = computed(() => {
  return {
    template: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${getIconPath(props.type)}
      </svg>
    `
  }
})

// 获取图标路径
function getIconPath(type: string) {
  switch (type) {
    case 'cube':
      return '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>'
    case 'sphere':
      return '<circle cx="12" cy="12" r="10"></circle>'
    case 'cylinder':
      return '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>'
    case 'pyramid':
      return '<polygon points="12 2 2 19 22 19"></polygon>'
    case 'custom':
      return '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>'
    default:
      return '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>'
  }
}

// 计算元素名称
const elementName = computed(() => {
  return elementNames[props.type]
})

// 计算元素描述
const elementDescription = computed(() => {
  return elementDescriptions[props.type]
})

// 拖拽开始事件处理
const onDragStart = (event: DragEvent) => {
  // 创建元素的默认属性
  const elementData = {
    id: uuidv4(),
    name: elementName.value,
    type: props.type,
    position: { x: 0, y: 0, z: 0 },
    size: { 
      width: 1, 
      height: 1, 
      depth: 1, 
      radius: 0.5 
    },
    color: '#' + Math.floor(Math.random()*16777215).toString(16),
    number: '',
    modelUrl: props.modelUrl || ''
  }
  
  // 将元素数据存储到拖拽事件中
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/json', JSON.stringify(elementData))
    // 兼容工作区旧逻辑：提供 elementType 字段
    event.dataTransfer.setData('elementType', props.type)
  }
}
</script>
