import { defineStore } from 'pinia'
import { apiGet, apiPost } from '../utils/request'

// ===== 接口类型定义（与 screenCase-api.md 文档一致） =====

interface Position3D { x: number; y: number; z: number }
interface Size3D { width: number; height: number; depth: number; radius: number }
interface Position2D { x: number; y: number; width: number; height: number }

export interface ScreenElement {
  id: string
  name: string
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid' | 'custom'
  position: Position3D
  size: Size3D
  color: string
  number: string
  modelUrl?: string
}

export interface ScreenChart {
  id: string
  type: 'bar' | 'line' | 'pie' | 'gauge' | 'map'
  title: string
  position: Position2D
  data: any
}

export interface CaseMeta {
  createdAt: number
  updatedAt: number
}

/** 大屏案例（与后端 Schema 对齐） */
export interface ScreenCase {
  _id: string
  name: string
  description?: string
  type: '3d' | '2d'
  elements?: ScreenElement[]
  charts?: ScreenChart[]
  thumbnail?: string
  ownerId?: string
  ownerName?: string
  state?: number       // 1=正常, 0=已删除
  sort?: number
  meta?: CaseMeta
}

/** 创建案例请求参数 */
export interface CreateCaseParams {
  name?: string
  description?: string
  type: '3d' | '2d'
  elements?: ScreenElement[]
  charts?: ScreenChart[]
  thumbnail?: string
}

/** 更新案例请求参数 */
export interface UpdateCaseParams {
  id: string
  name?: string
  description?: string
  elements?: ScreenElement[]
  charts?: ScreenChart[]
  thumbnail?: string
}

// ===== Store =====

export const useCasesStore = defineStore('cases', {
  state: () => ({
    /** 当前页的案例列表（来自服务端） */
    cases: [] as ScreenCase[],
    /** 加载状态 */
    loading: false,
    /** 总数（用于分页） */
    total: 0,
    /** 当前页码 */
    currentPage: 1,
    /** 每页条数 */
    pageSize: 20,
    /** 当前筛选类型 */
    currentType: undefined as '3d' | '2d' | undefined,
  }),

  actions: {
    // ========== 1. 获取案例列表 ==========
    async fetchCases(page = 1, type?: '3d' | '2d') {
      this.loading = true
      this.currentPage = page
      this.currentType = type

      try {
        const params = new URLSearchParams()
        params.set('page', String(page))
        if (type) params.set('type', type)

        const list = await apiGet<ScreenCase[]>(`/screenCase/list?${params.toString()}`)
        this.cases = Array.isArray(list) ? list : []
        this.total = this.cases.length
      } catch (err: any) {
        console.error('[cases] 获取列表失败:', err.message)
        this.cases = []
      } finally {
        this.loading = false
      }
    },

    // ========== 2. 获取案例详情（返回完整数据） ==========
    async fetchCaseDetail(id: string): Promise<ScreenCase | null> {
      try {
        return await apiGet<ScreenCase>(`/screenCase/detail?id=${id}`)
      } catch (err: any) {
        console.error('[cases] 获取详情失败:', err.message)
        return null
      }
    },

    // ========== 3. 创建大屏案例 ==========
    async createCase(params: CreateCaseParams): Promise<ScreenCase | null> {
      try {
        const res = await apiPost<{ id: string; name: string }>('/screenCase/create', params)
        // 创建成功后将新案例插入本地列表头部，避免重新拉取
        const newItem: ScreenCase = {
          _id: res.id || '',
          name: params.name || '未命名大屏',
          description: params.description,
          type: params.type,
          elements: params.elements || [],
          charts: params.charts || [],
          thumbnail: params.thumbnail,
          meta: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          state: 1,
        }
        this.cases.unshift(newItem)
        return newItem
      } catch (err: any) {
        console.error('[cases] 创建失败:', err.message)
        throw err
      }
    },

    // ========== 4. 更新大屏案例 ==========
    async updateCase(params: UpdateCaseParams): Promise<boolean> {
      try {
        await apiPost('/screenCase/update', params)
        // 本地同步更新
        const idx = this.cases.findIndex(c => c._id === params.id)
        if (idx !== -1) {
          Object.assign(this.cases[idx], params, {
            meta: {
              ...this.cases[idx].meta,
              updatedAt: Date.now(),
            }
          })
        }
        return true
      } catch (err: any) {
        console.error('[cases] 更新失败:', err.message)
        throw err
      }
    },

    // ========== 5. 删除大屏案例（软删除） ==========
    async deleteCase(id: string): Promise<boolean> {
      try {
        await apiPost('/screenCase/delete', { id })
        // 从本地列表移除
        this.cases = this.cases.filter(c => c._id !== id)
        return true
      } catch (err: any) {
        console.error('[cases] 删除失败:', err.message)
        throw err
      }
    },

    // ===== 兼容旧代码的 getter 方法 =====
    getAllCases(): ScreenCase[] {
      return this.cases
    },

    getCaseById(id: string): ScreenCase | null {
      return this.cases.find(c => c._id === id) || null
    },

    getCasesByOwner(_ownerName?: string, _ownerId?: string): ScreenCase[] {
      // 服务端已按登录用户过滤，直接返回当前列表即可
      return this.cases
    },

    /** 刷新当前列表 */
    async refresh() {
      await this.fetchCases(this.currentPage, this.currentType)
    }
  }
})
