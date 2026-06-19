import { defineStore } from 'pinia'
import { apiPost, apiGet } from '../utils/request'

/** 用户信息（后端返回的完整字段） */
export interface UserInfo {
  _id?: string
  mobile: string
  nickname: string
  headImg: string
  job: string
  company: string
  introduce: string
  homepage: string
  state?: boolean
  role?: number
  articleNum?: number
  like?: number
  focu?: number
  fans?: number
  tag?: number
  sort?: number
  loginNum?: number
  meta?: {
    registTime: number
    loginTime: number
  }
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as UserInfo | null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    initialize() {
      if (this.initialized) return
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const userStr = localStorage.getItem(USER_KEY)
        this.token = token
        this.user = userStr ? JSON.parse(userStr) as UserInfo : null
      } catch (_) {
        // ignore
      } finally {
        this.initialized = true
      }
    },

    setAuth(token: string | null, user: UserInfo | null) {
      this.token = token
      this.user = user
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
      else localStorage.removeItem(USER_KEY)
    },

    logout() {
      this.setAuth(null, null)
    },

    /** ===== 1. 用户登录 ===== */
    async login(mobile: string, password: string) {
      const token = localStorage.getItem('auth_token')
      const headers: HeadersInit = { 'Content-Type': 'application/json', ...(token ? { token } : {}) }
      const response = await fetch(`/api/user/login`, { method: 'POST', headers, body: JSON.stringify({ mobile, password }) })
      const res = await response.json() as { code?: number; msg?: string; token?: string; data?: UserInfo }
      if (res.code !== 200) {
        throw new Error(res.msg || '登录失败')
      }
      const authToken = res.token || null
      const userInfo: UserInfo | null = res.data || null
      this.setAuth(authToken, userInfo)
      return { token: authToken, user: userInfo }
    },

    /** ===== 2. 用户注册 ===== */
    async register(params: { nickname: string; mobile: string; password: string; code: string }) {
      return await apiPost('/user/register', params)
    },

    /** ===== 3. 获取验证码（返回 SVG 图片）===== */
    async getCode(mobile: string) {
      return await apiPost<string>('/user/getCode', { mobile })
    },

    /** ===== 4. 获取用户信息 ===== */
    async fetchUserInfo() {
      const info = await apiGet<UserInfo>('/user/getUserInfo')
      this.user = info
      if (info) localStorage.setItem(USER_KEY, JSON.stringify(info))
      return info
    },

    /** ===== 5. 修改用户信息 ===== */
    async editUserInfo(data: Partial<Pick<UserInfo, 'nickname' | 'headImg' | 'job' | 'company' | 'introduce' | 'homepage'>>) {
      await apiPost('/user/editUserInfo', data)
      // 修改成功后刷新本地用户信息
      if (this.user) {
        Object.assign(this.user, data)
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
      }
    },

    /** ===== 6. 修改密码 ===== */
    async changePassword(password: string, newPassword: string) {
      return await apiPost('/user/changePassword', { password, newPassword })
    }
  }
})
