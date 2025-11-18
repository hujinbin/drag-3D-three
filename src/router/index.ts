import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/EditorView.vue'
import HomeView from '../views/HomeView.vue'
import CasesView from '../views/CasesView.vue'
import CaseDetailView from '../views/CaseDetailView.vue'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editor',
    name: 'editor',
    component: EditorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/cases',
    name: 'cases',
    component: CasesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/case/:id/:mode',
    name: 'case-detail',
    component: CaseDetailView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
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

export default router