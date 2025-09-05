import { createWebHistory, createRouter } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./App.vue')
    }
  ]
})