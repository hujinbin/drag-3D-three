<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-sm bg-white shadow rounded-lg p-6">
      <!-- Tab 切换 -->
      <div class="flex mb-4 border-b border-gray-200">
        <button
          :class="['flex-1 py-2 text-center font-medium transition', mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
          @click="switchMode('login')"
        >登录</button>
        <button
          :class="['flex-1 py-2 text-center font-medium transition', mode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
          @click="switchMode('register')"
        >注册</button>
      </div>

      <!-- 登录表单 -->
      <form v-if="mode === 'login'" @submit.prevent="onLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <input v-model="loginForm.mobile" type="tel"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入手机号" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="loginForm.password" type="password"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入密码" />
        </div>
        <button type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
          :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-if="mode === 'register'" @submit.prevent="onRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
          <input v-model="regForm.nickname" type="text"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入昵称" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <input v-model="regForm.mobile" type="tel"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入手机号" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input v-model="regForm.password" type="password"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="请输入密码" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
          <div class="flex gap-2">
            <input v-model="regForm.code" type="text"
              class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入验证码" />
            <button type="button" @click="onGetCode"
              :disabled="codeLoading || countdown > 0"
              class="px-3 py-2 text-sm border rounded hover:bg-gray-50 transition whitespace-nowrap disabled:opacity-50">
              {{ countdown > 0 ? `${countdown}s` : (codeSvg ? '刷新验证码' : '获取验证码') }}
            </button>
          </div>
          <!-- SVG 验证码图片展示 -->
          <div v-if="codeSvg" class="mt-2 flex justify-center" v-html="codeSvg"></div>
        </div>
        <button type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
          :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <p v-if="errorMessage" class="text-sm text-red-600 mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-sm text-green-600 mt-2">{{ successMessage }}</p>

      <div class="mt-4 text-center">
        <router-link to="/" class="text-blue-600 hover:underline text-sm">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// 模式切换：login / register
const mode = ref<'login' | 'register'>('login')

// 登录表单
const loginForm = reactive({ mobile: '', password: '' })
// 注册表单
const regForm = reactive({ nickname: '', mobile: '', password: '', code: '' })

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 验证码相关
const codeSvg = ref('')
const codeLoading = ref(false)
const countdown = ref(0)

function switchMode(m: 'login' | 'register') {
  if (mode.value !== m) {
    mode.value = m
    errorMessage.value = ''
    successMessage.value = ''
  }
}

/** 获取图形验证码 */
async function onGetCode() {
  const mobile = regForm.mobile.trim()
  if (!mobile) { errorMessage.value = '请先输入手机号'; return }
  // 简单校验手机号格式
  if (!/^1\d{10}$/.test(mobile)) { errorMessage.value = '请输入正确的手机号'; return }

  codeLoading.value = true
  errorMessage.value = ''
  try {
    codeSvg.value = await auth.getCode(mobile)
  } catch (err: any) {
    errorMessage.value = err?.message || '获取验证码失败'
    codeSvg.value = ''
  } finally {
    codeLoading.value = false
  }
}

/** 登录 */
async function onLogin() {
  const mobile = loginForm.mobile.trim()
  const password = loginForm.password
  if (!mobile || !password) { errorMessage.value = '请填写完整信息'; return }

  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await auth.login(mobile, password)
    successMessage.value = '登录成功'
    const redirect = (route.query.redirect as string) || '/editor'
    router.replace(redirect)
  } catch (err: any) {
    errorMessage.value = err?.message || '登录失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

/** 注册 */
async function onRegister() {
  const { nickname, mobile, password, code } = regForm
  if (!nickname || !mobile || !password || !code) { errorMessage.value = '请填写完整信息'; return }

  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await auth.register({ nickname, mobile, password, code })
    successMessage.value = '注册成功，即将跳转到登录页...'
    setTimeout(() => {
      mode.value = 'login'
      loginForm.mobile = mobile
      loginForm.password = ''
      successMessage.value = ''
    }, 1500)
  } catch (err: any) {
    errorMessage.value = err?.message || '注册失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>
