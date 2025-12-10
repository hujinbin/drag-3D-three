import { defineStore } from 'pinia'

export interface Template {
  id: string
  name: string
  description: string
  icon: string
  data?: any
}

export const useTemplatesStore = defineStore('templates', {
  state: () => ({
    threeDTemplates: [
      {
        id: 'basic-3d',
        name: '基础3D场景',
        description: '包含基本的立方体、球体和圆柱体',
        icon: '🎲',
        data: {
          elements: [
            {
              id: 'cube-1',
              name: '立方体',
              type: 'cube',
              position: { x: -10, y: 0, z: 0 },
              size: { width: 5, height: 5, depth: 5, radius: 2.5 },
              color: '#4F46E5',
              number: '1'
            },
            {
              id: 'sphere-1',
              name: '球体',
              type: 'sphere',
              position: { x: 0, y: 0, z: 0 },
              size: { width: 3, height: 3, depth: 3, radius: 3 },
              color: '#06B6D4',
              number: '2'
            },
            {
              id: 'cylinder-1',
              name: '圆柱体',
              type: 'cylinder',
              position: { x: 10, y: 0, z: 0 },
              size: { width: 3, height: 6, depth: 3, radius: 2 },
              color: '#10B981',
              number: '3'
            }
          ]
        }
      },
      {
        id: 'building-3d',
        name: '建筑展示',
        description: '模拟建筑物和城市场景',
        icon: '🏢',
        data: {
          elements: [
            {
              id: 'building-1',
              name: '高楼A',
              type: 'cube',
              position: { x: -15, y: 0, z: -10 },
              size: { width: 6, height: 15, depth: 6, radius: 3 },
              color: '#6366F1',
              number: 'A'
            },
            {
              id: 'building-2',
              name: '高楼B',
              type: 'cube',
              position: { x: -5, y: 0, z: -5 },
              size: { width: 5, height: 12, depth: 5, radius: 2.5 },
              color: '#8B5CF6',
              number: 'B'
            },
            {
              id: 'building-3',
              name: '高楼C',
              type: 'cube',
              position: { x: 5, y: 0, z: -8 },
              size: { width: 7, height: 18, depth: 7, radius: 3.5 },
              color: '#A855F7',
              number: 'C'
            },
            {
              id: 'tower',
              name: '信号塔',
              type: 'cylinder',
              position: { x: 15, y: 0, z: -5 },
              size: { width: 2, height: 20, depth: 2, radius: 1.5 },
              color: '#EC4899',
              number: 'T'
            }
          ]
        }
      },
      {
        id: 'data-center-3d',
        name: '数据中心',
        description: '服务器机架可视化',
        icon: '💾',
        data: {
          elements: [
            {
              id: 'rack-1',
              name: '机架1',
              type: 'cube',
              position: { x: -12, y: 0, z: 0 },
              size: { width: 4, height: 10, depth: 3, radius: 2 },
              color: '#374151',
              number: '1'
            },
            {
              id: 'rack-2',
              name: '机架2',
              type: 'cube',
              position: { x: -4, y: 0, z: 0 },
              size: { width: 4, height: 10, depth: 3, radius: 2 },
              color: '#374151',
              number: '2'
            },
            {
              id: 'rack-3',
              name: '机架3',
              type: 'cube',
              position: { x: 4, y: 0, z: 0 },
              size: { width: 4, height: 10, depth: 3, radius: 2 },
              color: '#374151',
              number: '3'
            },
            {
              id: 'rack-4',
              name: '机架4',
              type: 'cube',
              position: { x: 12, y: 0, z: 0 },
              size: { width: 4, height: 10, depth: 3, radius: 2 },
              color: '#374151',
              number: '4'
            }
          ]
        }
      }
    ] as Template[],
    echartsTemplates: [
      {
        id: 'basic-2d',
        name: '基础图表',
        description: '包含柱状图、折线图和饼图',
        icon: '📊',
        data: {
          charts: [
            {
              id: 'bar-chart',
              type: 'bar',
              title: '月度销售额',
              position: { x: 0, y: 0, width: 33, height: 50 },
              data: {
                xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
                series: [120, 200, 150, 80, 70, 110]
              }
            },
            {
              id: 'line-chart',
              type: 'line',
              title: '用户增长趋势',
              position: { x: 33, y: 0, width: 34, height: 50 },
              data: {
                xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
                series: [820, 932, 901, 934, 1290, 1330]
              }
            },
            {
              id: 'pie-chart',
              type: 'pie',
              title: '产品占比',
              position: { x: 67, y: 0, width: 33, height: 50 },
              data: [
                { name: '产品A', value: 335 },
                { name: '产品B', value: 310 },
                { name: '产品C', value: 234 },
                { name: '产品D', value: 135 }
              ]
            }
          ]
        }
      },
      {
        id: 'dashboard-2d',
        name: '数据仪表板',
        description: '综合数据展示看板',
        icon: '📈',
        data: {
          charts: [
            {
              id: 'gauge-1',
              type: 'gauge',
              title: 'CPU使用率',
              position: { x: 0, y: 0, width: 25, height: 33 },
              data: {
                value: 75,
                max: 100
              }
            },
            {
              id: 'gauge-2',
              type: 'gauge',
              title: '内存使用率',
              position: { x: 25, y: 0, width: 25, height: 33 },
              data: {
                value: 62,
                max: 100
              }
            },
            {
              id: 'gauge-3',
              type: 'gauge',
              title: '磁盘使用率',
              position: { x: 50, y: 0, width: 25, height: 33 },
              data: {
                value: 45,
                max: 100
              }
            },
            {
              id: 'gauge-4',
              type: 'gauge',
              title: '网络负载',
              position: { x: 75, y: 0, width: 25, height: 33 },
              data: {
                value: 88,
                max: 100
              }
            },
            {
              id: 'line-area',
              type: 'line',
              title: '实时监控',
              position: { x: 0, y: 33, width: 100, height: 67 },
              data: {
                xAxis: Array.from({ length: 20 }, (_, i) => `${i}:00`),
                series: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100))
              }
            }
          ]
        }
      },
      {
        id: 'map-2d',
        name: '地图可视化',
        description: '地理数据分布展示',
        icon: '🗺️',
        data: {
          charts: [
            {
              id: 'china-map',
              type: 'map',
              title: '全国销售分布',
              position: { x: 0, y: 0, width: 70, height: 100 },
              data: [
                { name: '北京', value: 1200 },
                { name: '上海', value: 1500 },
                { name: '广东', value: 2000 },
                { name: '浙江', value: 1800 },
                { name: '江苏', value: 1600 }
              ]
            },
            {
              id: 'top-cities',
              type: 'bar',
              title: 'TOP 10 城市',
              position: { x: 70, y: 0, width: 30, height: 100 },
              data: {
                yAxis: ['上海', '北京', '深圳', '广州', '杭州', '南京', '成都', '武汉', '西安', '重庆'],
                series: [1500, 1200, 980, 850, 720, 680, 650, 620, 580, 550]
              }
            }
          ]
        }
      }
    ] as Template[]
  }),

  actions: {
    getTemplateById(type: '3d' | '2d', id: string): Template | undefined {
      const templates = type === '3d' ? this.threeDTemplates : this.echartsTemplates
      return templates.find(t => t.id === id)
    }
  }
})
