import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/EditorView.vue'
import HomeView from '../views/HomeView.vue'
import CasesView from '../views/CasesView.vue'
import CaseDetailView from '../views/CaseDetailView.vue'

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
  },
  {
    path: '/cases',
    name: 'cases',
    component: CasesView
  },
  {
    path: '/case/:id/:mode',
    name: 'case-detail',
    component: CaseDetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router