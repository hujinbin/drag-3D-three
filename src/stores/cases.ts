import { defineStore } from 'pinia'

// 定义元素接口
interface Element {
  id: string
  name: string
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid' | 'custom'
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string
  number: string
  modelUrl?: string
}

// 定义案例接口
interface Case {
  id: string
  name: string
  description?: string
  elements: Element[]
  thumbnail?: string
  ownerName?: string
  ownerId?: number
  createdAt: number
  updatedAt: number
}

// 本地存储键名
const STORAGE_KEY = 'drag-3d-cases'

// 创建案例存储
export const useCasesStore = defineStore('cases', {
  state: () => ({
    cases: [] as Case[]
  }),
  
  actions: {
    // 初始化从本地存储加载数据
    initialize() {
      try {
        const storedCases = localStorage.getItem(STORAGE_KEY)
        if (storedCases) {
          this.cases = JSON.parse(storedCases)
        }
      } catch (error) {
        console.error('Failed to load cases from localStorage:', error)
      }
    },
    
    // 保存数据到本地存储
    saveToLocalStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cases))
      } catch (error) {
        console.error('Failed to save cases to localStorage:', error)
      }
    },
    
    // 获取所有案例
    getAllCases() {
      return this.cases
    },
    
    // 根据ID获取案例
    getCaseById(id: string) {
      return this.cases.find(c => c.id === id) || null
    },
    
    // 创建新案例
    createCase(name: string = '未命名模型', elements: Element[] = [], owner?: { ownerName?: string; ownerId?: number }) {
      const newCase: Case = {
        id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        elements,
        ownerName: owner?.ownerName,
        ownerId: owner?.ownerId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      this.cases.push(newCase)
      this.saveToLocalStorage()
      
      return newCase
    },
    // 根据拥有者获取案例
    getCasesByOwner(ownerName?: string, ownerId?: number) {
      if (!ownerName && !ownerId) return this.cases
      return this.cases.filter(c => {
        const byName = ownerName ? c.ownerName === ownerName : true
        const byId = typeof ownerId === 'number' ? c.ownerId === ownerId : true
        return byName && byId
      })
    },
    
    // 更新案例
    updateCase(updatedCase: Case) {
      const index = this.cases.findIndex(c => c.id === updatedCase.id)
      if (index !== -1) {
        this.cases[index] = {
          ...updatedCase,
          updatedAt: Date.now()
        }
        this.saveToLocalStorage()
        return true
      }
      return false
    },
    
    // 删除案例
    deleteCase(id: string) {
      this.cases = this.cases.filter(c => c.id !== id)
      this.saveToLocalStorage()
    },
    
    // 生成缩略图（这里只是一个占位函数，实际实现可能需要使用canvas或其他方式生成缩略图）
    generateThumbnail(caseId: string, thumbnailData: string) {
      const caseToUpdate = this.cases.find(c => c.id === caseId)
      if (caseToUpdate) {
        caseToUpdate.thumbnail = thumbnailData
        this.saveToLocalStorage()
        return true
      }
      return false
    }
  }
})

// 初始化存储
export function initializeCasesStore() {
  const store = useCasesStore()
  store.initialize()
  return store
}
