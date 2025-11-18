<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-sm bg-white shadow rounded-lg p-6">
      <h1 class="text-xl font-semibold mb-4 text-gray-800">登录</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="username"
            type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            v-model="password"
            type="password"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入密码"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <p v-if="errorMessage" class="text-sm text-red-600 mt-2">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-sm text-green-600 mt-2">{{ successMessage }}</p>
      </form>

      <div class="mt-4 text-center">
        <router-link to="/" class="text-blue-600 hover:underline text-sm">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// 默认填充为指定的账号，便于直接测试
const username = ref('uiAdmin')
const password = ref('a123456')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 这里直接发起到 /api/login，开发环境由 Vite 代理到 https://card.leheavengame.com/
async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    // 有的接口返回非 2xx 状态但仍有 JSON，需要兼容处理
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || `登录失败（${res.status}）`)
    }

    // 将返回的 token 或用户信息保存（假设返回 { token, user }）
    const token: string | null = data?.token || null
    const user = (data?.user && typeof data.user === 'object') ? data.user : { username: username.value }
    auth.setAuth(token, user)

    successMessage.value = '登录成功'
    // 可跳转到编辑器或首页
    setTimeout(() => {
      const redirect = (route.query.redirect as string) || '/editor'
      router.push(redirect)
    }, 600)
  } catch (err: any) {
    errorMessage.value = err?.message || '登录失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>