import { createRouter, createWebHistory } from 'vue-router'
import { buildRoutes } from './pages'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: buildRoutes(),
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta.requiresAuth !== false
  if (!requiresAuth) return next()

  const userStore = useUserStore()
  if (!userStore.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  next()
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'YFPO MES PDA'
  document.title = `${title} - YFPO MES PDA`
})

export default router
