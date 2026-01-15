import { defineStore } from 'pinia'
import drivers from '@/data/drivers.json'
import router from '@/router'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
  }),

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin',
  },

  actions: {
    login(email, password) {
      const user = drivers.find(
        d => d.email === email && d.password === password
      )

      if (!user) {
        throw new Error('Neplatné přihlašovací údaje')
      }

      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
      router.push('/login')
    },
  },
})