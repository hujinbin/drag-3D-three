import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/EditorView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
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