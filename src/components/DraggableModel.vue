<template>
  <div 
    class="draggable-model"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="model-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="model-info">
      <div class="model-name">{{ modelName }}</div>
      <div class="model-format">{{ fileFormat }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  modelUrl: string
  modelName: string
}>()

// 计算文件格式
const fileFormat = computed(() => {
  const extension = props.modelUrl.split('.').pop()?.toLowerCase() || ''
  return extension.toUpperCase()
})

// 处理拖拽开始事件
const handleDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  
  // 创建一个新的元素对象
  const element = {
    id: uuidv4(),
    name: props.modelName,
    type: 'custom',
    position: { x: 0, y: 0, z: 0 },
    size: { width: 1, height: 1, depth: 1, radius: 0.5 },
    color: '#' + Math.floor(Math.random() * 16777215).toString(16), // 随机颜色
    number: '',
    modelUrl: props.modelUrl
  }
  
  // 将元素数据存储在拖拽事件中
  event.dataTransfer.setData('application/json', JSON.stringify(element))
  event.dataTransfer.effectAllowed = 'copy'
}
</script>

<style scoped>
.draggable-model {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: grab;
  transition: all 0.2s ease;
}

.draggable-model:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.draggable-model:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.model-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #64748b;
}

.model-icon svg {
  width: 24px;
  height: 24px;
}

.model-info {
  display: flex;
  flex-direction: column;
}

.model-name {
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.model-format {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
}
</style>