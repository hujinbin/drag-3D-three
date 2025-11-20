import { defineStore } from 'pinia'
import { apiPost } from '../utils/request'

interface AuthUser {
  username: string
  id?: number
  role?: number
  apiKey?: string
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as AuthUser | null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    initialize() {
      if (this.initialized) return
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const userStr = localStorage.getItem(USER_KEY)
        this.token = token
        this.user = userStr ? JSON.parse(userStr) as AuthUser : null
      } catch (_) {
        // ignore
      } finally {
        this.initialized = true
      }
    },
    setAuth(token: string | null, user: AuthUser | null) {
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
    async login(username: string, password: string) {
      // 针对返回 { code, data: { token, userName, id, role, apiKey }, msg }
      const data = await apiPost<{ token: string; userName: string; id?: number; role?: number; apiKey?: string }>(
        '/api/login',
        { username, password }
      )
      const token = data?.token || null
      const user: AuthUser | null = data
        ? { username: data.userName, id: data.id, role: data.role, apiKey: data.apiKey }
        : { username }
      this.setAuth(token, user)
      return data
    },
    async changePassword(oldPassword: string, newPassword: string) {
      return await apiPost('/api/changePassword', { oldPassword, newPassword })
    }
  }
})