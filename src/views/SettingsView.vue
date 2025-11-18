<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 class="text-xl font-semibold mb-4 text-gray-800">个人设置</h1>

      <div class="mb-6">
        <p class="text-sm text-gray-600">当前用户</p>
        <p class="text-base font-medium text-gray-900">{{ username || '未登录' }}</p>
      </div>

      <h2 class="text-lg font-semibold mb-3 text-gray-800">修改密码</h2>
      <form @submit.prevent="onChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">旧密码</label>
          <input v-model="oldPassword" type="password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" placeholder="请输入旧密码" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
          <input v-model="newPassword" type="password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" placeholder="请输入新密码" />
        </div>

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition" :disabled="loading">
          {{ loading ? '提交中...' : '保存密码' }}
        </button>

        <p v-if="errorMessage" class="text-sm text-red-600 mt-2">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-sm text-green-600 mt-2">{{ successMessage }}</p>
      </form>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
auth.initialize()

const oldPassword = ref('')
const newPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const username = computed(() => auth.user?.username || '')

async function onChangePassword() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  try {
    await auth.changePassword(oldPassword.value, newPassword.value)
    successMessage.value = '密码修改成功'
    oldPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    errorMessage.value = err?.message || '修改密码失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>