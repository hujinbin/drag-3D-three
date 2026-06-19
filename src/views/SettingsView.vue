<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-md mx-auto space-y-6">
      <!-- 用户信息卡片 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-xl font-semibold mb-4 text-gray-800">个人中心</h1>

        <!-- 头像 + 昵称 -->
        <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <img :src="form.headImg || defaultAvatar" alt="头像"
            class="w-16 h-16 rounded-full object-cover border border-gray-200" />
          <div>
            <p class="font-medium text-gray-900">{{ form.nickname || '未设置昵称' }}</p>
            <p class="text-sm text-gray-500">{{ auth.user?.mobile || '' }}</p>
          </div>
        </div>

        <!-- 统计信息 -->
        <div v-if="auth.user && !editing" class="grid grid-cols-3 gap-4 text-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <p class="text-lg font-bold text-blue-600">{{ auth.user.articleNum ?? 0 }}</p>
            <p class="text-xs text-gray-500">文章</p>
          </div>
          <div>
            <p class="text-lg font-bold text-red-400">{{ auth.user.like ?? 0 }}</p>
            <p class="text-xs text-gray-500">获赞</p>
          </div>
          <div class="flex justify-center gap-4">
            <div>
              <p class="text-lg font-bold text-green-600">{{ auth.user.focu ?? 0 }}</p>
              <p class="text-xs text-gray-500">关注</p>
            </div>
            <div>
              <p class="text-lg font-bold text-purple-600">{{ auth.user.fans ?? 0 }}</p>
              <p class="text-xs text-gray-500">粉丝</p>
            </div>
          </div>
        </div>

        <!-- 编辑模式表单 -->
        <form v-if="editing" @submit.prevent="onSaveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
            <input v-model="form.nickname" type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入昵称" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">头像 URL</label>
            <input v-model="form.headImg" type="url"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入头像图片地址" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">职位</label>
            <input v-model="form.job" type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入职位" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">公司</label>
            <input v-model="form.company" type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入公司名称" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">个人介绍</label>
            <textarea v-model="form.introduce" rows="3"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="介绍一下你自己"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">个人主页</label>
            <input v-model="form.homepage" type="url"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入主页链接" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
              :disabled="saving">
              {{ saving ? '保存中...' : '保存修改' }}
            </button>
            <button type="button" @click="cancelEdit" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">取消</button>
          </div>
        </form>

        <!-- 非编辑模式：显示信息和操作按钮 -->
        <template v-if="!editing">
          <div class="space-y-3 text-sm text-gray-600">
            <p><span class="text-gray-400 w-16 inline-block">职位：</span>{{ auth.user?.job || '未填写' }}</p>
            <p><span class="text-gray-400 w-16 inline-block">公司：</span>{{ auth.user?.company || '未填写' }}</p>
            <p><span class="text-gray-400 w-16 inline-block">介绍：</span>{{ auth.user?.introduce || '未填写' }}</p>
          </div>
          <button @click="startEdit" class="mt-4 w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded transition">编辑资料</button>
        </template>
      </div>

      <!-- 修改密码卡片 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-3 text-gray-800">修改密码</h2>
        <form @submit.prevent="onChangePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">原密码</label>
            <input v-model="pwdForm.oldPassword" type="password"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入原密码" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input v-model="pwdForm.newPassword" type="password"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="请输入新密码" />
          </div>
          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
            :disabled="pwLoading">
            {{ pwLoading ? '提交中...' : '修改密码' }}
          </button>
          <p v-if="pwErrorMsg" class="text-sm text-red-600 mt-2">{{ pwErrorMsg }}</p>
          <p v-if="pwSuccessMsg" class="text-sm text-green-600 mt-2">{{ pwSuccessMsg }}</p>
        </form>
      </div>

      <!-- 全局提示 -->
      <p v-if="globalError" class="text-sm text-red-600 text-center mt-2">{{ globalError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore, type UserInfo } from '../stores/auth'

const auth = useAuthStore()
const defaultAvatar = 'http://cdn.leheavengame.com/head_def.png'

// 编辑状态
const editing = ref(false)
const saving = ref(false)
const globalError = ref('')

// 表单数据
const form = reactive<Partial<Pick<UserInfo, 'nickname' | 'headImg' | 'job' | 'company' | 'introduce' | 'homepage'>>>({
  nickname: '',
  headImg: '',
  job: '',
  company: '',
  introduce: '',
  homepage: ''
})

function startEdit() {
  const u = auth.user
  form.nickname = u?.nickname || ''
  form.headImg = u?.headImg !== defaultAvatar ? (u?.headImg || '') : ''
  form.job = u?.job || ''
  form.company = u?.company || ''
  form.introduce = u?.introduce || ''
  form.homepage = u?.homepage || ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  globalError.value = ''
}

async function onSaveProfile() {
  if (!form.nickname) { globalError.value = '昵称不能为空'; return }
  saving.value = true
  globalError.value = ''
  try {
    await auth.editUserInfo(form)
    editing.value = false
  } catch (err: any) {
    globalError.value = err?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

// 密码相关
const pwdForm = reactive({ oldPassword: '', newPassword: '' })
const pwLoading = ref(false)
const pwErrorMsg = ref('')
const pwSuccessMsg = ref('')

async function onChangePassword() {
  const { oldPassword, newPassword } = pwdForm
  if (!oldPassword || !newPassword) { pwErrorMsg.value = '请填写完整'; return }

  pwLoading.value = true
  pwErrorMsg.value = ''
  pwSuccessMsg.value = ''

  try {
    await auth.changePassword(oldPassword, newPassword)
    pwSuccessMsg.value = '密码修改成功'
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
  } catch (err: any) {
    pwErrorMsg.value = err?.message || '修改密码失败'
  } finally {
    pwLoading.value = false
  }
}

onMounted(async () => {
  // 进入页面时刷新用户信息
  if (auth.isAuthenticated) {
    try {
      await auth.fetchUserInfo()
    } catch (_) {
      // 静默处理
    }
  }
})
</script>
