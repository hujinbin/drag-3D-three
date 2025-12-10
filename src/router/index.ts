import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/EditorView.vue'
import HomeView from '../views/HomeView.vue'
import CasesView from '../views/CasesView.vue'
import CaseDetailView from '../views/CaseDetailView.vue'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'
import SelectScreenType from '../views/SelectScreenType.vue'
import ThreeDScreen from '../views/ThreeDScreen.vue'
import EChartsScreen from '../views/EChartsScreen.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // 主页标题采用产品定位短语
    meta: { title: '这是一个通过拖拉拽，自动生成3D、二维的大屏页面的应用' }
  },
  {
    path: '/editor',
    name: 'editor',
    component: EditorView,
    meta: { requiresAuth: true, title: '编辑器' }
  },
  {
    path: '/select-screen',
    name: 'select-screen',
    component: SelectScreenType,
    meta: { requiresAuth: true, title: '选择大屏类型' }
  },
  {
    path: '/3d-screen/:templateId?',
    name: '3d-screen',
    component: ThreeDScreen,
    meta: { requiresAuth: true, title: '3D大屏' }
  },
  {
    path: '/2d-screen/:templateId?',
    name: '2d-screen',
    component: EChartsScreen,
    meta: { requiresAuth: true, title: '2D大屏' }
  },
  {
    path: '/cases',
    name: 'cases',
    component: CasesView,
    meta: { requiresAuth: true, title: '案例库' }
  },
  {
    path: '/case/:id/:mode',
    name: 'case-detail',
    component: CaseDetailView,
    props: true,
    meta: { requiresAuth: true, title: '案例详情' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true, title: '设置' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  auth.initialize()
  const isAuthed = auth.isAuthenticated
  if (to.name === 'login' && isAuthed) {
    next({ name: 'editor' })
    return
  }
  if (to.matched.some(r => (r.meta as any)?.requiresAuth) && !isAuthed) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

// 路由跳转后更新网页标题
import { useCasesStore } from '../stores/cases'
router.afterEach((to) => {
  const baseTitle = '拖屏工坊'
  let pageTitle = baseTitle

  const metaTitle = (to.meta as any)?.title as string | undefined
  if (to.name === 'case-detail') {
    const cases = useCasesStore()
    try { cases.initialize() } catch {}
    const id = String(to.params.id || '')
    const mode = String(to.params.mode || '')
    const caseItem = id ? cases.getCaseById(id) : null
    const name = caseItem?.name || '未命名模型'
    const modeText = mode === 'edit' ? '编辑' : mode === 'view' ? '查看' : '案例'
    pageTitle = `${modeText} · ${name} - ${baseTitle}`
  } else if (metaTitle) {
    pageTitle = `${metaTitle} - ${baseTitle}`
  }

  document.title = pageTitle
})

export default router
