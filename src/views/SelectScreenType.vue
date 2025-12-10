<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">选择大屏类型</h1>
        <p class="text-lg text-gray-600">选择适合您需求的大屏展示方式</p>
      </div>

      <!-- 选择卡片 -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- 3D大屏 -->
        <div
          class="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          @click="selectType('3d')"
        >
          <div class="h-64 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <div class="text-center text-white">
              <svg class="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <h2 class="text-3xl font-bold">Three.js 3D 大屏</h2>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">使用 Three.js 创建立体、可交互的 3D 可视化大屏</p>
            <ul class="space-y-2 text-sm text-gray-500">
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                3D 立体场景
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                自由视角旋转
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                拖拽放置元素
              </li>
            </ul>
          </div>
        </div>

        <!-- 2D大屏 -->
        <div
          class="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          @click="selectType('2d')"
        >
          <div class="h-64 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <div class="text-center text-white">
              <svg class="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <h2 class="text-3xl font-bold">ECharts 2D 大屏</h2>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">使用 ECharts 创建专业的 2D 数据可视化大屏</p>
            <ul class="space-y-2 text-sm text-gray-500">
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                丰富的图表类型
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                数据实时更新
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                响应式布局
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 模板选择 -->
      <div v-if="selectedType" class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          选择{{ selectedType === '3d' ? '3D' : '2D' }}模板
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="template in currentTemplates"
            :key="template.id"
            class="border-2 border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:shadow-lg"
            @click="selectTemplate(template.id)"
          >
            <div class="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-4xl">{{ template.icon }}</span>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">{{ template.name }}</h3>
            <p class="text-sm text-gray-600">{{ template.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplatesStore } from '../stores/templates'

const router = useRouter()
const templatesStore = useTemplatesStore()

const selectedType = ref<'3d' | '2d' | null>(null)

const currentTemplates = computed(() => {
  if (selectedType.value === '3d') {
    return templatesStore.threeDTemplates
  } else if (selectedType.value === '2d') {
    return templatesStore.echartsTemplates
  }
  return []
})

const selectType = (type: '3d' | '2d') => {
  selectedType.value = type
}

const selectTemplate = (templateId: string) => {
  if (selectedType.value === '3d') {
    router.push({ name: '3d-screen', params: { templateId } })
  } else if (selectedType.value === '2d') {
    router.push({ name: '2d-screen', params: { templateId } })
  }
}
</script>
