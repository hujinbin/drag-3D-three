import { defineStore } from 'pinia'

interface AuthUser {
  username: string
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
    async changePassword(oldPassword: string, newPassword: string) {
      const res = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
        },
        body: JSON.stringify({ oldPassword, newPassword })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || `修改密码失败（${res.status}）`)
      }
      return data
    }
  }
})