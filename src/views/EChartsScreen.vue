<template>
  <div class="h-screen w-screen bg-gray-900 flex flex-col">
    <!-- 顶部工具栏 -->
    <div class="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between z-50">
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-1"
        >&larr; 返回</button>
        <h1 class="text-xl font-bold text-white">{{ templateName }}</h1>
        <span class="text-xs px-2 py-0.5 rounded-full"
          :class="isEditMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-400'"
        >{{ isEditMode ? '编辑模式' : '预览模式' }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="isEditMode = !isEditMode"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2',
            isEditMode ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-700 hover:bg-gray-600'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          {{ isEditMode ? '完成编辑' : '编辑布局' }}
        </button>

        <!-- 添加图表（带类型选择下拉） -->
        <div v-if="isEditMode" class="relative group">
          <button
            @click="showChartTypeMenu = !showChartTypeMenu"
            class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            添加图表
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform" :class="{ 'rotate-180': showChartTypeMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <!-- 图表类型选择菜单 -->
          <Transition name="fade">
            <div v-if="showChartTypeMenu"
              class="absolute right-0 top-full mt-2 w-56 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-50"
            >
              <div class="px-3 py-2 text-xs font-medium text-gray-400 border-b border-gray-700">选择图表类型</div>
              <button
                v-for="ct in chartTypes" :key="ct.type"
                @click="addChartWithType(ct.type)"
                class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
              >
                <span class="text-xl">{{ ct.icon }}</span>
                <div>
                  <div class="text-sm font-medium text-white">{{ ct.label }}</div>
                  <div class="text-[11px] text-gray-400">{{ ct.desc }}</div>
                </div>
              </button>
            </div>
          </Transition>
        </div>

        <button
          @click="refreshData"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          刷新数据
        </button>
        <button
          @click="toggleFullscreen"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >全屏</button>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="flex-1 relative overflow-hidden bg-gray-900" ref="containerRef">
      <!-- 网格背景 (仅编辑模式) -->
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
          <!-- 图表头部 -->
          <div class="px-4 py-2 bg-gray-700/90 border-b border-gray-600 flex justify-between items-center pointer-events-auto">
            <h3 class="text-white font-semibold select-none text-sm truncate">{{ chart.title }}</h3>
            <div v-if="isEditMode && selectedChartId === chart.id" class="flex items-center gap-1">
              <button @click.stop="deleteChart(chart.id)" class="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>
          <!-- 图表内容 -->
          <div class="flex-1 relative">
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
          <div class="w-2.5 h-2.5 bg-indigo-400 rounded-sm"></div>
        </div>
      </div>
    </div>

    <!-- 属性编辑面板 -->
    <Transition name="slide-up">
      <div v-if="isEditMode && selectedChart" class="absolute right-0 top-[57px] bottom-0 w-80 bg-gray-800 border-l border-gray-700 p-5 flex flex-col z-40 shadow-2xl overflow-y-auto custom-scroll">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>{{ getChartIcon(selectedChart.type) }}</span>
            图表属性
          </h3>
          <button @click="selectedChartId = null" class="text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">标题</label>
            <input v-model="selectedChart.title" type="text"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <!-- 位置 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">X (%)</label>
              <input v-model.number="selectedChart.position.x" type="number" step="1"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Y (%)</label>
              <input v-model.number="selectedChart.position.y" type="number" step="1"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <!-- 尺寸 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">宽度 (%)</label>
              <input v-model.number="selectedChart.position.width" type="number" min="5" step="1"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">高度 (%)</label>
              <input v-model.number="selectedChart.position.height" type="number" min="5" step="1"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <!-- 图表类型提示 -->
          <div class="bg-gray-700/50 rounded-lg p-3">
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <span class="text-base">{{ getChartIcon(selectedChart.type) }}</span>
              类型：<span class="text-indigo-400 font-medium">{{ getChartLabel(selectedChart.type) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplatesStore } from '../stores/templates'
import { use } from 'echarts/core'
import { registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, GaugeChart, MapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, GeoComponent, VisualMapComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LineChart, PieChart, GaugeChart, MapChart,
    TitleComponent, TooltipComponent, LegendComponent, GridComponent, GeoComponent, VisualMapComponent])

/** 图表类型定义 */
interface Chart {
  id: string; type: string; title: string
  position: { x: number; y: number; width: number; height: number }; data: any
}

/** 可选的图表类型列表 */
const chartTypes = [
  { type: 'bar', icon: '📊', label: '柱状图', desc: '对比分析，渐变色填充' },
  { type: 'line', icon: '📈', label: '折线图', desc: '趋势变化，平滑曲线' },
  { type: 'pie', icon: '🥧', label: '饼图', desc: '占比分布，环形设计' },
  { type: 'gauge', icon: '⚡', label: '仪表盘', desc: 'KPI 指标监控' },
  { type: 'map', icon: '🗺️', label: '地图', desc: '地理分布可视化' },
]

const route = useRoute()
const router = useRouter()
const templatesStore = useTemplatesStore()

const charts = ref<Chart[]>([])
const templateName = ref('2D 大屏')
const mapLoaded = ref(false)
const isEditMode = ref(false)
const selectedChartId = ref<string | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const showChartTypeMenu = ref(false)

const selectedChart = computed(() => charts.value.find(c => c.id === selectedChartId.value))

function getChartIcon(type: string): string {
  return chartTypes.find(ct => ct.type === type)?.icon || '?'
}
function getChartLabel(type: string): string {
  return chartTypes.find(ct => ct.type === type)?.label || type
}

const getChartStyle = (chart: Chart) => ({
  left: `${chart.position.x}%`, top: `${chart.position.y}%`,
  width: `${chart.position.width}%`, height: `${chart.position.height}%`
})

// ===== 拖拽和调整大小 =====
let isDragging = false; let isResizing = false
let startX = 0; let startY = 0; let startLeft = 0; let startTop = 0; let startWidth = 0; let startHeight = 0
let activeChart: Chart | null = null

const selectChart = (chart: Chart) => { if (!isEditMode.value) return; selectedChartId.value = chart.id }

/** 按指定类型添加图表 */
function addChartWithType(type: string) {
  showChartTypeMenu.value = false

  const defaultData = getDefaultChartData(type)
  const newChart: Chart = {
    id: `chart-${Date.now()}`,
    type,
    title: defaultData.title,
    position: { x: Math.random() * 40 + 5, y: Math.random() * 30 + 5, width: 30, height: 25 },
    data: defaultData.data
  }
  charts.value.push(newChart)
  selectedChartId.value = newChart.id
}

function getDefaultChartData(type: string) {
  switch (type) {
    case 'bar':
      return { title: '柱状图', data: { xAxis: ['A','B','C','D','E'], series: [12,34,56,28,41] } }
    case 'line':
      return { title: '折线图', data: { xAxis: ['1月','2月','3月','4月','5月','6月'], series: [82,93,91,104,129,133] } }
    case 'pie':
      return { title: '饼图', data: [{name:'A',value:335},{name:'B',value:310},{name:'C',value:234},{name:'D',value:135}] }
    case 'gauge':
      return { title: '仪表盘', data: { value: 72 } }
    case 'map':
      return { title: '地图', data: [{name:'北京',value:1200},{name:'上海',value:1500},{name:'广东',value:2000},{name:'浙江',value:1800},{name:'江苏',value:1600}] }
    default:
      return { title: '新图表', data: { series: [] } }
  }
}

const deleteChart = (id: string) => {
  charts.value = charts.value.filter(c => c.id !== id)
  if (selectedChartId.value === id) selectedChartId.value = null
}

const handleMouseDown = (e: MouseEvent, chart: Chart) => {
  if (!isEditMode.value) return
  selectChart(chart); isDragging = true; activeChart = chart
  startX = e.clientX; startY = e.clientY; startLeft = chart.position.x; startTop = chart.position.y
  window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp)
}
const handleResizeStart = (e: MouseEvent, chart: Chart) => {
  if (!isEditMode.value) return
  isResizing = true; activeChart = chart
  startX = e.clientX; startY = e.clientY; startWidth = chart.position.width; startHeight = chart.position.height
  window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!activeChart || !containerRef.value) return
  const cr = containerRef.value.getBoundingClientRect()
  const dx = ((e.clientX - startX) / cr.width) * 100
  const dy = ((e.clientY - startY) / cr.height) * 100

  if (isDragging) {
    const snap = (v: number) => Math.abs(v - Math.round(v / 5) * 5) < 1 ? Math.round(v / 5) * 5 : v
    activeChart.position.x = Math.max(0, Math.min(100 - activeChart.position.width, snap(startLeft + dx)))
    activeChart.position.y = Math.max(0, Math.min(100 - activeChart.position.height, snap(startTop + dy)))
  } else if (isResizing) {
    activeChart.position.width = Math.max(8, Math.min(100 - activeChart.position.x, startWidth + dx))
    activeChart.position.height = Math.max(8, Math.min(100 - activeChart.position.y, startHeight + dy))
  }
}
const onMouseUp = () => {
  isDragging = false; isResizing = false; activeChart = null
  window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp)
}

// ===== ECharts 配置 =====
const getChartOption = (chart: Chart) => {
  const base = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.85)', borderColor: '#333', textStyle: { color: '#fff' }, axisPointer: { crossStyle: { color: '#999' } } }
  }
  switch (chart.type) {
    case 'bar':
      return { ...base, grid: { left: 55, right: 20, top: 30, bottom: 30 },
        xAxis: { type: 'category', data: chart.data.xAxis || chart.data.yAxis, axisLine: { lineStyle:{color:'#666'}}, axisLabel:{color:'#999'} },
        yAxis: { type: 'value', axisLine: {lineStyle:{color:'#666'}}, axisLabel:{color:'#999'}, splitLine:{lineStyle:{color:'#333'}} },
        series: [{data: chart.data.series, type: 'bar', itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#3B82F6'},{offset:1,color:'#1D4ED8'}]}}}] }
    case 'line':
      return { ...base, grid: { left: 55, right: 20, top: 30, bottom: 30 },
        xAxis: { type: 'category', data: chart.data.xAxis, axisLine:{lineStyle:{color:'#666'}}, axisLabel:{color:'#999'} },
        yAxis: { type: 'value', axisLine:{lineStyle:{color:'#666'}}, axisLabel:{color:'#999'}, splitLine:{lineStyle:{color:'#333'}} },
        series: [{data: chart.data.series, type: 'line', smooth:true, lineStyle:{color:'#10B981',width:3},
          areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'rgba(16,185,129,0.3)'},{offset:1,color:'rgba(16,185,129,0.05)'}]}}}] }
    case 'pie':
      return { ...base, tooltip: { trigger: 'item', backgroundColor:'rgba(0,0,0,0.85)', borderColor:'#333', textStyle:{color:'#fff'} },
        legend: { orient:'vertical', right:'8%', top:'center', textStyle:{color:'#999'}, itemWidth:12,itemHeight:12 },
        series: [{type:'pie',radius:['38%','68%'], avoidLabelOverlap:false, itemStyle:{borderRadius:8,borderColor:'#1F2937',borderWidth:2},
          label:{show:true, color:'#999',fontSize:11}, emphasis:{label:{show:true,fontSize:14,fontWeight:'bold'}}, data: chart.data}] }
    case 'gauge':
      return { ...base, series: [{type:'gauge', progress:{show:true,width:16}, axisLine:{lineStyle:{width:16,color:[[0.3,'#10B981'],[0.7,'#F59E0B'],[1,'#EF4444']]}},
        axisTick:{show:false}, splitLine:{length:12,lineStyle:{width:2,color:'#999'}}, axisLabel:{distance:22,color:'#999',fontSize:11},
        anchor:{show:true,showAbove:true,size:22,itemStyle:{borderWidth:8,borderColor:'#3B82F6'}}, title:{show:false},
        detail:{valueAnimation:true,fontSize:28,offsetCenter:[0,'65%'],color:'#fff',formatter:'{value}%'}, data:[{value: chart.data.value}]}] }
    case 'map':
      return { ...base, tooltip: {trigger:'item', backgroundColor:'rgba(0,0,0,0.85)', borderColor:'#333', textStyle:{color:'#fff'} },
        visualMap: {min:0,max:2500,text:['高','低'],realtime:false,calculable:true,inRange:{color:['#50a3ba','#eac736','#d94e5d']},textStyle:{color:'#fff'},left:'left',bottom:20},
        geo: {map:'china',roam:true,itemStyle:{areaColor:'#323c48',borderColor:'#111'},
          emphasis:{itemStyle:{areaColor:'#2a333d'},label:{show:false}}},
        series:[{name:chart.title,type:'map',map:'china',geoIndex:0,data:chart.data}] }
    default: return base
  }
}

onMounted(async () => {
  const tid = route.params.templateId as string
  if (tid) {
    const tpl = templatesStore.getTemplateById('2d', tid)
    if (tpl) { templateName.value = tpl.name
      if (tpl.data?.charts) {
        const hasMap = tpl.data.charts.some((c:any) => c.type === 'map')
        if (hasMap) {
          try { const r = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'); const mj = await r.json(); registerMap('china', mj); mapLoaded.value = true }
          catch(e){ console.error('Failed to load map:', e) }
        } else { mapLoaded.value = true }
        charts.value = tpl.data.charts
      }
    }
  }
})

const goBack = () => router.push({ name: 'select-screen' })

const refreshData = () => {
  charts.value = charts.value.map(ch => ({
    ...ch,
    data: { ...ch.data, series: Array.isArray(ch.data.series) ? ch.data.series.map(() => Math.floor(Math.random()*100)) : ch.data.series }
  }))
}

const toggleFullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:all 0.15s ease}.fade-enter-from,.fade-leave-to{opacity:0;transform:translateY(-4px)}
.slide-up-enter-active,.slide-up-leave-active{transition:transform 0.25s ease}.slide-up-enter-from,.slide-up-leave-to{transform:translateX(100%)}

.custom-scroll::-webkit-scrollbar{width:6px}.custom-scroll::-webkit-scrollbar-track{background:transparent}.custom-scroll::-webkit-scrollbar-thumb{background:#4b5563;border-radius:3px}.custom-scroll::-webkit-scrollbar-thumb:hover{background:#6b7280}
</style>
