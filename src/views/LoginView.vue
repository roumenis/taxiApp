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
  <div class="login-container">
    <div class="login-box">
      <h1>Taxi Flotila</h1>
      <p class="subtitle">Přihlášení do systému</p>

      <div v-if="error" class="error-message">
        <span>{{ error }}</span>
      </div>

      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email"
            placeholder="vas@email.com"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Heslo</label>
          <input 
            id="password"
            v-model="password" 
            type="password"
            placeholder="Zadejte heslo"
            class="form-input"
            required
          />
        </div>

        <button type="submit" class="btn btn-login">
          Přihlásit se
        </button>
      </form>

    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10vh;
}

.login-box {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 380px;
}

.login-box h1 {
  margin: 0 0 3px 0;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.subtitle {
  margin: 0 0 20px 0;
  font-size: 13px;
  color: #999;
  text-align: center;
}

.error-message {
  background-color: #ffebee;
  border: 1px solid #f44336;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #bbb;
}

.btn-login {
  padding: 10px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 5px;
}

.btn-login:hover {
  background-color: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-login:active {
  transform: translateY(0);
}

.demo-credentials {
  margin-top: 18px;
  padding-top: 12px;
  padding: 12px;
  border-top: 1px solid #eee;
  font-size: 11px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.demo-credentials p {
  margin: 3px 0;
  line-height: 1.4;
}

.demo-credentials p:first-child {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}
</style>