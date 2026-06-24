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
          @click="openSaveDialog"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
          保存
        </button>
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

          <!-- 图表数据编辑 -->
          <div class="border-t border-gray-700 pt-4">
            <h4 class="text-sm font-medium text-gray-300 mb-3">图表数据</h4>

            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">数据来源</label>
                <select v-model="selectedChartDataSourceType"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                  <option value="static">静态数据</option>
                  <option value="api">API 接口</option>
                </select>
              </div>

              <template v-if="selectedChartDataSourceType === 'static'">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">静态 JSON 数据</label>
                  <textarea v-model="staticDataText" rows="5"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div class="flex items-center gap-2">
                  <button @click="applyStaticDataText"
                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm transition-colors">
                    应用静态数据
                  </button>
                  <span v-if="dataSourceMessage" class="text-xs" :class="dataSourceError ? 'text-red-400' : 'text-green-400'">
                    {{ dataSourceMessage }}
                  </span>
                </div>
              </template>

              <template v-else>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">接口地址</label>
                  <input v-model="selectedApiConfig.url" type="text" placeholder="/api/demo/chartData"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">请求方法</label>
                    <select v-model="selectedApiConfig.method"
                      class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">响应路径</label>
                    <input v-model="selectedApiConfig.dataPath" type="text" placeholder="data.list"
                      class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Query 参数 JSON</label>
                  <textarea v-model="apiParamsText" rows="3"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">请求头 JSON</label>
                  <textarea v-model="apiHeadersText" rows="3"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div v-if="selectedApiConfig.method === 'POST'">
                  <label class="block text-xs text-gray-500 mb-1">Body JSON</label>
                  <textarea v-model="apiBodyText" rows="3"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div class="flex items-center gap-2">
                  <button @click="debugSelectedChartApi" :disabled="apiLoading"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm transition-colors">
                    {{ apiLoading ? '调试中...' : '调试并写入' }}
                  </button>
                  <span v-if="dataSourceMessage" class="text-xs" :class="dataSourceError ? 'text-red-400' : 'text-green-400'">
                    {{ dataSourceMessage }}
                  </span>
                </div>
                <pre v-if="apiPreviewText" class="max-h-32 overflow-auto bg-gray-900 border border-gray-700 rounded-lg p-2 text-[11px] text-gray-300 whitespace-pre-wrap">{{ apiPreviewText }}</pre>
              </template>
            </div>

            <!-- bar / line 数据编辑 -->
            <template v-if="selectedChartDataSourceType === 'static' && (selectedChart.type === 'bar' || selectedChart.type === 'line')">
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">X轴标签（每行一个）</label>
                  <textarea v-model="barLineXAxisText" rows="3"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">数值（每行一个，与标签对应）</label>
                  <textarea v-model="barLineSeriesText" rows="3"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
              </div>
            </template>

            <!-- pie / map 数据编辑 -->
            <template v-else-if="selectedChartDataSourceType === 'static' && (selectedChart.type === 'pie' || selectedChart.type === 'map')">
              <div class="space-y-2">
                <div v-for="(item, index) in selectedChart.data" :key="index" class="flex items-center gap-2">
                  <input v-model="item.name" type="text" placeholder="名称"
                    @change="syncStaticDataSource(selectedChart)"
                    class="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  <input v-model.number="item.value" type="number" placeholder="数值"
                    @change="syncStaticDataSource(selectedChart)"
                    class="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  <button @click="removePieMapItem(index)" class="text-red-400 hover:text-red-300 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  </button>
                </div>
                <button @click="addPieMapItem"
                  class="w-full py-1.5 border border-dashed border-gray-600 rounded text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors">
                  + 添加数据项
                </button>
              </div>
            </template>

            <!-- gauge 数据编辑 -->
            <template v-else-if="selectedChartDataSourceType === 'static' && selectedChart.type === 'gauge'">
              <div>
                <label class="block text-xs text-gray-500 mb-1">当前数值</label>
                <input v-model.number="selectedChart.data.value" type="number" min="0" max="100"
                  @change="syncStaticDataSource(selectedChart)"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 保存对话框 -->
    <Transition name="fade">
      <div v-if="saveDialogVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="saveDialogVisible = false">
        <div class="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-96 p-6">
          <h3 class="text-lg font-bold text-white mb-4">保存大屏案例</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">案例名称 <span class="text-red-400">*</span></label>
              <input v-model="caseName" type="text" placeholder="请输入案例名称"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">描述</label>
              <textarea v-model="caseDescription" rows="2" placeholder="可选描述"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>共 {{ charts.length }} 个图表</span>
              <span v-if="caseId" class="text-indigo-400">· 更新已有案例</span>
              <span v-else class="text-green-400">· 创建新案例</span>
            </div>
          </div>
          <div class="mt-5 space-y-2">
            <p v-if="saveError" class="text-sm text-red-400">{{ saveError }}</p>
            <p v-if="saveSuccess" class="text-sm text-green-400">{{ saveSuccess }}</p>
            <div class="flex gap-3">
              <button @click="onSaveCase" :disabled="saving"
                class="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors">
                {{ saving ? '保存中...' : '确认保存' }}
              </button>
              <button @click="saveDialogVisible = false"
                class="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                取消
              </button>
            </div>
            <button v-if="caseId" @click="goToCases"
              class="w-full text-center text-sm text-gray-500 hover:text-gray-300 py-1 transition-colors">
              前往案例库
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplatesStore } from '../stores/templates'
import { useCasesStore } from '../stores/cases'
import { use } from 'echarts/core'
import { registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, GaugeChart, MapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, GeoComponent, VisualMapComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LineChart, PieChart, GaugeChart, MapChart,
    TitleComponent, TooltipComponent, LegendComponent, GridComponent, GeoComponent, VisualMapComponent])

/** 图表类型定义 */
type ChartType = 'bar' | 'line' | 'pie' | 'gauge' | 'map'
type ChartDataSourceType = 'static' | 'api'
type HttpMethod = 'GET' | 'POST'

interface ChartApiConfig {
  url: string
  method: HttpMethod
  params: Record<string, any>
  headers: Record<string, any>
  body: any
  dataPath: string
}

interface ChartDataSource {
  type: ChartDataSourceType
  staticData?: any
  api?: ChartApiConfig
}

interface Chart {
  id: string; type: ChartType; title: string
  position: { x: number; y: number; width: number; height: number }; data: any
  dataSource?: ChartDataSource
}

/** 可选的图表类型列表 */
const chartTypes: { type: ChartType; icon: string; label: string; desc: string }[] = [
  { type: 'bar', icon: '📊', label: '柱状图', desc: '对比分析，渐变色填充' },
  { type: 'line', icon: '📈', label: '折线图', desc: '趋势变化，平滑曲线' },
  { type: 'pie', icon: '🥧', label: '饼图', desc: '占比分布，环形设计' },
  { type: 'gauge', icon: '⚡', label: '仪表盘', desc: 'KPI 指标监控' },
  { type: 'map', icon: '🗺️', label: '地图', desc: '地理分布可视化' },
]

const route = useRoute()
const router = useRouter()
const templatesStore = useTemplatesStore()
const casesStore = useCasesStore()

const charts = ref<Chart[]>([])
const templateName = ref('2D 大屏')
const mapLoaded = ref(false)
const isEditMode = ref(false)
const selectedChartId = ref<string | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const showChartTypeMenu = ref(false)

// 保存相关状态
const caseId = ref<string | null>(null)
const caseName = ref('')
const caseDescription = ref('')
const saveDialogVisible = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const dataSourceMessage = ref('')
const dataSourceError = ref(false)
const apiLoading = ref(false)
const apiPreviewText = ref('')

const selectedChart = computed(() => charts.value.find(c => c.id === selectedChartId.value))

watch(selectedChartId, () => {
  staticDataDraft.value = ''
  apiParamsDraft.value = null
  apiHeadersDraft.value = null
  apiBodyDraft.value = null
  clearDataSourceStatus()
})

const selectedChartDataSourceType = computed<ChartDataSourceType>({
  get: () => selectedChart.value?.dataSource?.type || 'static',
  set: (type) => {
    const chart = selectedChart.value
    if (!chart) return
    ensureChartDataSource(chart)
    if (type === 'static') {
      chart.dataSource = {
        type: 'static',
        staticData: cloneData(chart.data)
      }
    } else {
      chart.dataSource = {
        type: 'api',
        staticData: chart.dataSource?.staticData,
        api: chart.dataSource?.api || createDefaultApiConfig()
      }
    }
    clearDataSourceStatus()
  }
})

const selectedApiConfig = computed<ChartApiConfig>(() => {
  const chart = selectedChart.value
  if (!chart) return createDefaultApiConfig()
  ensureChartDataSource(chart)
  if (chart.dataSource?.type !== 'api') {
    chart.dataSource = {
      type: 'api',
      staticData: chart.dataSource?.staticData,
      api: chart.dataSource?.api || createDefaultApiConfig()
    }
  }
  chart.dataSource.api = {
    ...createDefaultApiConfig(),
    ...(chart.dataSource.api || {})
  }
  return chart.dataSource.api
})

const staticDataText = computed({
  get: () => {
    if (staticDataDraft.value) return staticDataDraft.value
    const chart = selectedChart.value
    if (!chart) return ''
    ensureChartDataSource(chart)
    return JSON.stringify(chart.dataSource?.staticData ?? chart.data, null, 2)
  },
  set: (value: string) => {
    staticDataDraft.value = value
  }
})

const staticDataDraft = ref('')
const apiParamsDraft = ref<string | null>(null)
const apiHeadersDraft = ref<string | null>(null)
const apiBodyDraft = ref<string | null>(null)

const apiParamsText = computed({
  get: () => apiParamsDraft.value ?? JSON.stringify(selectedChart.value?.dataSource?.api?.params || {}, null, 2),
  set: (value: string) => { apiParamsDraft.value = value }
})

const apiHeadersText = computed({
  get: () => apiHeadersDraft.value ?? JSON.stringify(selectedChart.value?.dataSource?.api?.headers || {}, null, 2),
  set: (value: string) => { apiHeadersDraft.value = value }
})

const apiBodyText = computed({
  get: () => apiBodyDraft.value ?? JSON.stringify(selectedChart.value?.dataSource?.api?.body || {}, null, 2),
  set: (value: string) => { apiBodyDraft.value = value }
})

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

function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data ?? null))
}

function createDefaultApiConfig(): ChartApiConfig {
  return {
    url: '',
    method: 'GET',
    params: {},
    headers: {},
    body: {},
    dataPath: ''
  }
}

function createStaticDataSource(data: any): ChartDataSource {
  return {
    type: 'static',
    staticData: cloneData(data)
  }
}

function ensureChartDataSource(chart: Chart) {
  if (!chart.dataSource) {
    chart.dataSource = createStaticDataSource(chart.data)
  }
  if (chart.dataSource.type === 'static') {
    chart.dataSource.staticData = chart.dataSource.staticData ?? cloneData(chart.data)
  }
  if (chart.dataSource.type === 'api') {
    chart.dataSource.api = {
      ...createDefaultApiConfig(),
      ...(chart.dataSource.api || {})
    }
  }
}

function normalizeChart(chart: Chart): Chart {
  const normalized = cloneData(chart)
  ensureChartDataSource(normalized)
  return normalized
}

function clearDataSourceStatus() {
  dataSourceMessage.value = ''
  dataSourceError.value = false
  apiPreviewText.value = ''
}

function setDataSourceStatus(message: string, isError = false) {
  dataSourceMessage.value = message
  dataSourceError.value = isError
}

function safeJsonParse(value: string, fallback: any, fieldName: string) {
  const text = value.trim()
  if (!text) return fallback
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`${fieldName} 不是有效 JSON`)
  }
}

function getByPath(source: any, path?: string) {
  if (!path?.trim()) return source
  return path.split('.').filter(Boolean).reduce((acc, key) => acc == null ? undefined : acc[key], source)
}

function buildApiUrl(config: ChartApiConfig) {
  const url = new URL(config.url, window.location.origin)
  Object.entries(config.params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

async function requestChartApi(config: ChartApiConfig) {
  if (!config.url.trim()) throw new Error('请填写接口地址')
  const init: RequestInit = {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...(config.headers || {})
    }
  }
  if (config.method === 'POST') {
    init.body = JSON.stringify(config.body ?? {})
  }

  const response = await fetch(buildApiUrl(config), init)
  const text = await response.text()
  let body: any = text
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    // 非 JSON 响应也展示出来，便于定位接口问题。
  }
  if (!response.ok) {
    throw new Error(`接口请求失败：${response.status} ${response.statusText}`)
  }
  const data = getByPath(body, config.dataPath)
  if (data === undefined) {
    throw new Error('响应路径未匹配到数据')
  }
  return { body, data }
}

function applyStaticDataText() {
  const chart = selectedChart.value
  if (!chart) return
  try {
    const data = safeJsonParse(staticDataText.value, chart.data, '静态数据')
    chart.data = cloneData(data)
    chart.dataSource = createStaticDataSource(data)
    staticDataDraft.value = ''
    setDataSourceStatus('静态数据已应用')
  } catch (err: any) {
    setDataSourceStatus(err?.message || '静态数据格式错误', true)
  }
}

async function debugSelectedChartApi() {
  const chart = selectedChart.value
  if (!chart) return
  ensureChartDataSource(chart)
  const api = chart.dataSource?.api
  if (!api) return

  apiLoading.value = true
  clearDataSourceStatus()
  try {
    api.params = safeJsonParse(apiParamsText.value, {}, 'Query 参数')
    api.headers = safeJsonParse(apiHeadersText.value, {}, '请求头')
    api.body = safeJsonParse(apiBodyText.value, {}, 'Body')
    const { body, data } = await requestChartApi(api)
    chart.data = cloneData(data)
    chart.dataSource = {
      type: 'api',
      staticData: chart.dataSource?.staticData,
      api: cloneData(api)
    }
    apiParamsDraft.value = null
    apiHeadersDraft.value = null
    apiBodyDraft.value = null
    apiPreviewText.value = JSON.stringify({ raw: body, extracted: data }, null, 2)
    setDataSourceStatus('接口数据已写入')
  } catch (err: any) {
    setDataSourceStatus(err?.message || '接口调试失败', true)
  } finally {
    apiLoading.value = false
  }
}

// ===== 拖拽和调整大小 =====
let isDragging = false; let isResizing = false
let startX = 0; let startY = 0; let startLeft = 0; let startTop = 0; let startWidth = 0; let startHeight = 0
let activeChart: Chart | null = null

const selectChart = (chart: Chart) => { if (!isEditMode.value) return; selectedChartId.value = chart.id }

/** 按指定类型添加图表 */
function addChartWithType(type: ChartType) {
  showChartTypeMenu.value = false

  const defaultData = getDefaultChartData(type)
  const newChart: Chart = {
    id: `chart-${Date.now()}`,
    type,
    title: defaultData.title,
    position: { x: Math.random() * 40 + 5, y: Math.random() * 30 + 5, width: 30, height: 25 },
    data: defaultData.data,
    dataSource: createStaticDataSource(defaultData.data)
  }
  charts.value.push(newChart)
  selectedChartId.value = newChart.id
}

function getDefaultChartData(type: ChartType) {
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

// ===== 图表数据编辑 =====
/** bar/line 的 xAxis 文本（逗号分隔） */
const barLineXAxisText = computed({
  get: () => {
    const c = selectedChart.value
    if (!c || (c.type !== 'bar' && c.type !== 'line')) return ''
    return (c.data.xAxis || []).join('\\n')
  },
  set: (val: string) => {
    const c = selectedChart.value
    if (!c || (c.type !== 'bar' && c.type !== 'line')) return
    c.data.xAxis = val.split('\\n').map(s => s.trim()).filter(Boolean)
    syncStaticDataSource(c)
  }
})
/** bar/line 的 series 数值文本（逗号分隔） */
const barLineSeriesText = computed({
  get: () => {
    const c = selectedChart.value
    if (!c || (c.type !== 'bar' && c.type !== 'line')) return ''
    return (c.data.series || []).join('\\n')
  },
  set: (val: string) => {
    const c = selectedChart.value
    if (!c || (c.type !== 'bar' && c.type !== 'line')) return
    c.data.series = val.split('\\n').map(s => Number(s.trim())).filter(n => !isNaN(n))
    syncStaticDataSource(c)
  }
})

function syncStaticDataSource(chart?: Chart) {
  if (!chart) return
  ensureChartDataSource(chart)
  if (chart.dataSource?.type === 'static') {
    chart.dataSource.staticData = cloneData(chart.data)
    staticDataDraft.value = ''
  }
}

/** 为 pie/map 添加数据项 */
function addPieMapItem() {
  const c = selectedChart.value
  if (!c || (c.type !== 'pie' && c.type !== 'map')) return
  if (!Array.isArray(c.data)) c.data = []
  c.data.push({ name: '新项', value: 0 })
  syncStaticDataSource(c)
}
/** 删除 pie/map 数据项 */
function removePieMapItem(index: number) {
  const c = selectedChart.value
  if (!c || (c.type !== 'pie' && c.type !== 'map')) return
  c.data.splice(index, 1)
  syncStaticDataSource(c)
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
  const cid = route.query.caseId as string
  if (cid) {
    // 从已有案例加载
    await loadCaseData(cid)
  } else if (tid) {
    const tpl = templatesStore.getTemplateById('2d', tid)
    if (tpl) {
      templateName.value = tpl.name
      caseName.value = tpl.name
      if (tpl.data?.charts) {
        const hasMap = tpl.data.charts.some((c: any) => c.type === 'map')
        if (hasMap) {
          try { const r = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'); const mj = await r.json(); registerMap('china', mj); mapLoaded.value = true }
          catch (e) { console.error('Failed to load map:', e) }
        } else { mapLoaded.value = true }
        charts.value = JSON.parse(JSON.stringify(tpl.data.charts)).map(normalizeChart)
      }
    }
  }
})

const goBack = () => router.push({ name: 'select-screen' })

const refreshData = async () => {
  clearDataSourceStatus()
  let apiCount = 0
  let staticCount = 0
  const nextCharts = await Promise.all(charts.value.map(async (ch) => {
    ensureChartDataSource(ch)
    if (ch.dataSource?.type === 'api' && ch.dataSource.api?.url) {
      try {
        const { data } = await requestChartApi(ch.dataSource.api)
        apiCount += 1
        return { ...ch, data: cloneData(data) }
      } catch (err: any) {
        console.error('[charts] API 刷新失败:', err.message)
        return ch
      }
    }
    staticCount += 1
    if (Array.isArray(ch.data?.series)) {
      const data = { ...ch.data, series: ch.data.series.map(() => Math.floor(Math.random() * 100)) }
      return { ...ch, data, dataSource: createStaticDataSource(data) }
    }
    return ch
  }))
  charts.value = nextCharts
  setDataSourceStatus(`已刷新：API ${apiCount} 个，静态 ${staticCount} 个`)
}

const toggleFullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()

// ===== 加载和保存案例 =====
/** 加载已有案例 */
async function loadCaseData(id: string) {
  try {
    const detail = await casesStore.fetchCaseDetail(id)
    if (detail && detail.charts) {
      caseId.value = detail._id
      caseName.value = detail.name || ''
      caseDescription.value = detail.description || ''
      templateName.value = detail.name || '2D 大屏'
      charts.value = JSON.parse(JSON.stringify(detail.charts)).map(normalizeChart)
      const hasMap = charts.value.some((c: any) => c.type === 'map')
      if (hasMap) {
        try { const r = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'); const mj = await r.json(); registerMap('china', mj); mapLoaded.value = true }
        catch(e){ console.error('Failed to load map:', e) }
      } else { mapLoaded.value = true }
    }
  } catch (err: any) {
    alert('加载案例失败：' + (err?.message || '未知错误'))
  }
}

/** 打开保存对话框 */
function openSaveDialog() {
  if (!caseName.value) caseName.value = templateName.value
  saveDialogVisible.value = true
  saveError.value = ''
  saveSuccess.value = ''
}

/** 保存案例 */
async function onSaveCase() {
  if (!caseName.value.trim()) { saveError.value = '请输入案例名称'; return }
  if (charts.value.length === 0) { saveError.value = '请至少添加一个图表'; return }

  saving.value = true
  saveError.value = ''
  saveSuccess.value = ''

  try {
    const payloadCharts = charts.value.map(c => ({
      id: c.id,
      type: c.type,
      title: c.title,
      position: { ...c.position },
      data: JSON.parse(JSON.stringify(c.data)),
      dataSource: JSON.parse(JSON.stringify({
        ...(c.dataSource || createStaticDataSource(c.data)),
        staticData: (c.dataSource?.type || 'static') === 'static' ? c.data : c.dataSource?.staticData
      }))
    }))

    if (caseId.value) {
      await casesStore.updateCase({
        id: caseId.value,
        name: caseName.value.trim(),
        description: caseDescription.value.trim(),
        charts: payloadCharts
      })
      saveSuccess.value = '保存成功'
      templateName.value = caseName.value
      setTimeout(() => { saveDialogVisible.value = false }, 1000)
    } else {
      const newCase = await casesStore.createCase({
        name: caseName.value.trim(),
        description: caseDescription.value.trim(),
        type: '2d',
        charts: payloadCharts
      })
      if (newCase) {
        caseId.value = newCase._id
        saveSuccess.value = '保存成功'
        templateName.value = caseName.value
        setTimeout(() => { saveDialogVisible.value = false }, 1000)
      }
    }
  } catch (err: any) {
    saveError.value = err?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

/** 前往案例库 */
function goToCases() { router.push('/cases') }
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:all 0.15s ease}.fade-enter-from,.fade-leave-to{opacity:0;transform:translateY(-4px)}
.slide-up-enter-active,.slide-up-leave-active{transition:transform 0.25s ease}.slide-up-enter-from,.slide-up-leave-to{transform:translateX(100%)}

.custom-scroll::-webkit-scrollbar{width:6px}.custom-scroll::-webkit-scrollbar-track{background:transparent}.custom-scroll::-webkit-scrollbar-thumb{background:#4b5563;border-radius:3px}.custom-scroll::-webkit-scrollbar-thumb:hover{background:#6b7280}
</style>
