import { createRouter, createWebHistory } from 'vue-router'
import DriverView from '@/views/DriverView.vue'
import MyReservationView from '@/views/MyReservationView.vue'
import AdminView from '@/views/AdminView.vue'

const routes = [
  { path: '/', component: DriverView },
  { path: '/my-reservations', component: MyReservationView}, 
  { path: '/admin', component: AdminView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router