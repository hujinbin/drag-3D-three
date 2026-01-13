<template>
  <div class="h-screen w-screen bg-gray-900 flex flex-col">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between z-50">
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
          @click="isEditMode = !isEditMode"
          class="px-4 py-2 text-white rounded-lg transition-colors flex items-center"
          :class="isEditMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {{ isEditMode ? '完成编辑' : '编辑布局' }}
        </button>
        <button
          v-if="isEditMode"
          @click="addChart"
          class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          添加图表
        </button>
        <button
          @click="refreshData"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          刷新数据
        </button>
        <button
          @click="toggleFullscreen"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          全屏
        </button>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="flex-1 relative overflow-hidden bg-gray-900" ref="containerRef">
      <!-- 网格背景 (仅编辑模式显示) -->
      <div v-if="isEditMode" class="absolute inset-0 pointer-events-none z-0" 
        style="background-image: radial-gradient(#374151 1px, transparent 1px); background-size: 20px 20px;">
      </div>

      <div
        v-for="chart in charts"
        :key="chart.id"
        class="absolute bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-shadow duration-200"
        :class="{ 
          'ring-2 ring-indigo-500 z-10': isEditMode && selectedChartId === chart.id,
          'hover:ring-1 hover:ring-indigo-400 cursor-move': isEditMode
        }"
        :style="getChartStyle(chart)"
        @mousedown="handleMouseDown($event, chart)"
        @click.stop="selectChart(chart)"
      >
        <div class="h-full flex flex-col pointer-events-none">
          <div class="px-4 py-2 bg-gray-700 border-b border-gray-600 flex justify-between items-center pointer-events-auto">
            <h3 class="text-white font-semibold select-none">{{ chart.title }}</h3>
            <div v-if="isEditMode && selectedChartId === chart.id" class="flex items-center">
              <button @click.stop="deleteChart(chart.id)" class="text-red-400 hover:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1 relative">
            <!-- 遮罩层，防止拖拽时触发图表交互 -->
            <div v-if="isEditMode" class="absolute inset-0 z-10 bg-transparent pointer-events-auto"></div>
            <v-chart
              v-if="chart.type !== 'map' || mapLoaded"
              :option="getChartOption(chart)"
              :autoresize="true"
              class="w-full h-full pointer-events-auto"
            />
          </div>
        </div>

        <!-- 调整大小手柄 -->
        <div
          v-if="isEditMode && selectedChartId === chart.id"
          class="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-20 flex items-end justify-end p-1"
          @mousedown.stop="handleResizeStart($event, chart)"
        >
          <div class="w-2 h-2 bg-white rounded-sm"></div>
        </div>
      </div>
    </div>

    <!-- 属性编辑面板 -->
    <div v-if="isEditMode && selectedChart" class="w-80 bg-gray-800 border-l border-gray-700 p-4 flex flex-col z-50 shadow-2xl absolute right-0 top-[60px] bottom-0 overflow-y-auto transition-transform duration-300">
      <h3 class="text-lg font-bold text-white mb-4">图表属性</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">标题</label>
          <input 
            v-model="selectedChart.title" 
            type="text" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">位置 X (%)</label>
          <input 
            v-model.number="selectedChart.position.x" 
            type="number" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">位置 Y (%)</label>
          <input 
            v-model.number="selectedChart.position.y" 
            type="number" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">宽度 (%)</label>
          <input 
            v-model.number="selectedChart.position.width" 
            type="number" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">高度 (%)</label>
          <input 
            v-model.number="selectedChart.position.height" 
            type="number" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplatesStore } from '../stores/templates'
import { use } from 'echarts/core'
import { registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  MapChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GeoComponent,
  VisualMapComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GeoComponent,
  VisualMapComponent
])

interface Chart {
  id: string
  type: string
  title: string
  position: { x: number; y: number; width: number; height: number }
  data: any
}

const route = useRoute()
const router = useRouter()
const templatesStore = useTemplatesStore()

const charts = ref<Chart[]>([])
const templateName = ref('2D 大屏')
const mapLoaded = ref(false)
const isEditMode = ref(false)
const selectedChartId = ref<string | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const selectedChart = computed(() => {
  return charts.value.find(c => c.id === selectedChartId.value)
})

const getChartStyle = (chart: Chart) => {
  return {
    left: `${chart.position.x}%`,
    top: `${chart.position.y}%`,
    width: `${chart.position.width}%`,
    height: `${chart.position.height}%`
  }
}

// 拖拽和调整大小相关变量
let isDragging = false
let isResizing = false
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0
let startWidth = 0
let startHeight = 0
let activeChart: Chart | null = null

const selectChart = (chart: Chart) => {
  if (!isEditMode.value) return
  selectedChartId.value = chart.id
}

const addChart = () => {
  const newChart: Chart = {
    id: `chart-${Date.now()}`,
    type: 'bar',
    title: '新图表',
    position: { x: 40, y: 40, width: 20, height: 20 },
    data: {
      xAxis: ['A', 'B', 'C', 'D', 'E'],
      series: [10, 20, 30, 40, 50]
    }
  }
  charts.value.push(newChart)
  selectedChartId.value = newChart.id
}

const deleteChart = (id: string) => {
  charts.value = charts.value.filter(c => c.id !== id)
  if (selectedChartId.value === id) {
    selectedChartId.value = null
  }
}

const handleMouseDown = (e: MouseEvent, chart: Chart) => {
  if (!isEditMode.value) return
  
  selectChart(chart)
  isDragging = true
  activeChart = chart
  startX = e.clientX
  startY = e.clientY
  startLeft = chart.position.x
  startTop = chart.position.y
  
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const handleResizeStart = (e: MouseEvent, chart: Chart) => {
  if (!isEditMode.value) return
  
  isResizing = true
  activeChart = chart
  startX = e.clientX
  startY = e.clientY
  startWidth = chart.position.width
  startHeight = chart.position.height
  
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!activeChart || !containerRef.value) return
  
  const containerRect = containerRef.value.getBoundingClientRect()
  const deltaX = ((e.clientX - startX) / containerRect.width) * 100
  const deltaY = ((e.clientY - startY) / containerRect.height) * 100
  
  if (isDragging) {
    // 限制在容器内
    const newX = startLeft + deltaX
    const newY = startTop + deltaY
    
    // 简单的吸附功能 (5%)
    const snap = (val: number) => {
      const snapped = Math.round(val / 5) * 5
      return Math.abs(val - snapped) < 1 ? snapped : val
    }

    activeChart.position.x = Math.max(0, Math.min(100 - activeChart.position.width, snap(newX)))
    activeChart.position.y = Math.max(0, Math.min(100 - activeChart.position.height, snap(newY)))
  } else if (isResizing) {
    const newWidth = startWidth + deltaX
    const newHeight = startHeight + deltaY
    
    activeChart.position.width = Math.max(5, Math.min(100 - activeChart.position.x, newWidth))
    activeChart.position.height = Math.max(5, Math.min(100 - activeChart.position.y, newHeight))
  }
}

const onMouseUp = () => {
  isDragging = false
  isResizing = false
  activeChart = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

const getChartOption = (chart: Chart) => {
  const baseOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      }
    }
  }

  switch (chart.type) {
    case 'bar':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: chart.data.xAxis || chart.data.yAxis,
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [
          {
            data: chart.data.series,
            type: 'bar',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#3B82F6' },
                  { offset: 1, color: '#1D4ED8' }
                ]
              }
            }
          }
        ]
      }

    case 'line':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: chart.data.xAxis,
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#666' } },
          axisLabel: { color: '#999' },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [
          {
            data: chart.data.series,
            type: 'line',
            smooth: true,
            lineStyle: { color: '#10B981', width: 3 },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                  { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                ]
              }
            }
          }
        ]
      }

    case 'pie':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#333',
          textStyle: { color: '#fff' }
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          top: 'center',
          textStyle: { color: '#999' }
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#1F2937',
              borderWidth: 2
            },
            label: {
              show: true,
              color: '#999'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: chart.data
          }
        ]
      }

    case 'gauge':
      return {
        ...baseOption,
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 18
            },
            axisLine: {
              lineStyle: {
                width: 18,
                color: [
                  [0.3, '#10B981'],
                  [0.7, '#F59E0B'],
                  [1, '#EF4444']
                ]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 12
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 25,
              itemStyle: {
                borderWidth: 10,
                borderColor: '#3B82F6'
              }
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 30,
              offsetCenter: [0, '70%'],
              color: '#fff',
              formatter: '{value}%'
            },
            data: [
              {
                value: chart.data.value
              }
            ]
          }
        ]
      }

    case 'map':
      return {
        ...baseOption,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#333',
          textStyle: { color: '#fff' }
        },
        visualMap: {
          min: 0,
          max: 2000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          },
          textStyle: {
            color: '#fff'
          },
          left: 'left',
          bottom: 'bottom'
        },
        geo: {
          map: 'china',
          roam: true,
          itemStyle: {
            areaColor: '#323c48',
            borderColor: '#111'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2a333d'
            },
            label: {
              show: false
            }
          }
        },
        series: [
          {
            name: chart.title,
            type: 'map',
            map: 'china',
            geoIndex: 0,
            data: chart.data
          }
        ]
      }

    default:
      return baseOption
  }
}

onMounted(async () => {
  const templateId = route.params.templateId as string
  if (templateId) {
    const template = templatesStore.getTemplateById('2d', templateId)
    if (template) {
      templateName.value = template.name
      if (template.data?.charts) {
        // 如果包含地图图表，加载地图数据
        const hasMap = template.data.charts.some((c: any) => c.type === 'map')
        if (hasMap) {
          try {
            const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
            const mapJson = await response.json()
            registerMap('china', mapJson)
            mapLoaded.value = true
          } catch (error) {
            console.error('Failed to load map data:', error)
          }
        } else {
          mapLoaded.value = true
        }
        
        charts.value = template.data.charts
      }
    }
  }
})

const goBack = () => {
  router.push({ name: 'select-screen' })
}

const refreshData = () => {
  // 模拟数据刷新
  charts.value = charts.value.map(chart => ({
    ...chart,
    data: {
      ...chart.data,
      series: Array.isArray(chart.data.series)
        ? chart.data.series.map(() => Math.floor(Math.random() * 100))
        : chart.data.series
    }
  }))
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
