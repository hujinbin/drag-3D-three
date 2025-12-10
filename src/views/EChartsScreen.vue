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
    <div class="flex-1 p-4 overflow-auto">
      <div class="h-full grid gap-4" :style="gridStyle">
        <div
          v-for="chart in charts"
          :key="chart.id"
          class="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          :style="getChartStyle(chart)"
        >
          <div class="h-full flex flex-col">
            <div class="px-4 py-2 bg-gray-700 border-b border-gray-600">
              <h3 class="text-white font-semibold">{{ chart.title }}</h3>
            </div>
            <div class="flex-1">
              <v-chart
                :option="getChartOption(chart)"
                :autoresize="true"
                class="w-full h-full"
              />
            </div>
          </div>
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
  GeoComponent
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
  GeoComponent
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

const gridStyle = computed(() => {
  // 根据图表数量和位置动态生成网格布局
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: 'repeat(12, 1fr)'
  }
})

const getChartStyle = (chart: Chart) => {
  const colStart = Math.floor((chart.position.x / 100) * 12) + 1
  const colEnd = colStart + Math.floor((chart.position.width / 100) * 12)
  const rowStart = Math.floor((chart.position.y / 100) * 12) + 1
  const rowEnd = rowStart + Math.floor((chart.position.height / 100) * 12)
  
  return {
    gridColumn: `${colStart} / ${colEnd}`,
    gridRow: `${rowStart} / ${rowEnd}`
  }
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

    default:
      return baseOption
  }
}

onMounted(() => {
  const templateId = route.params.templateId as string
  if (templateId) {
    const template = templatesStore.getTemplateById('2d', templateId)
    if (template) {
      templateName.value = template.name
      if (template.data?.charts) {
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
