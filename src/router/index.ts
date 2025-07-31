import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import EditorView from '../views/EditorView.vue'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editor',
    name: 'editor',
    component: EditorView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router