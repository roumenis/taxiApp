import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import DriverView from '@/views/DriverView.vue'
import MyReservationView from '@/views/MyReservationView.vue'
import AdminView from '@/views/AdminView.vue'

const routes = [
  { path: '/login', component: LoginView },

  { path: '/', component: DriverView, meta: { requiresAuth: true } },
  { path: '/my-reservations', component: MyReservationView, meta: { requiresAuth: true } }, 
  { path: '/admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuth()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return '/'
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    return '/'
  }
})
export default router