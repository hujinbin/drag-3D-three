<!-- src/components/ElementToolbar.vue -->
<template>
  <div class="bg-gray-100 p-4 shadow-lg h-full flex flex-col">
    <h3 class="text-lg font-semibold mb-4">元素库</h3>
    <div class="space-y-3">
      <DraggableElement 
        v-for="elementType in elementTypes" 
        :key="elementType" 
        :type="elementType"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

// 定义元素类型
type ElementType = 'cube' | 'sphere' | 'cylinder' | 'pyramid'

const elementTypes: ElementType[] = ['cube', 'sphere', 'cylinder', 'pyramid']
</script>