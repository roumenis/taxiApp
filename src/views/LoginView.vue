<script setup>

    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuth } from '@/stores/auth.js'

    const email = ref('')
    const password = ref('')
    const error = ref('')

    const auth = useAuth()
    const router = useRouter()

    const submit = () => {
        try {
            auth.login(email.value, password.value)
            router.push('/')
        } catch (e) {
            error.value = e.message
        }
    }
</script>

<template>
  <h2>Přihlášení</h2>

  <div v-if="error" style="color:red">{{ error }}</div>

  <div>
    <label>Email</label>
    <input v-model="email" type="email" />
  </div>

  <div>
    <label>Heslo</label>
    <input v-model="password" type="password" />
  </div>

  <button @click="submit">Přihlásit</button>
</template>