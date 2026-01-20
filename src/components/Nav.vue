<script setup>
  import { useAuth } from '@/stores/auth';

  const auth = useAuth();
</script>

<template>
  <nav class="nav" v-if="auth.isAuthenticated">
    <router-link v-if="auth.isAuthenticated" to="/" class="nav-link">
      Rezervace vozidla
    </router-link>

    <router-link v-if="auth.isAuthenticated" to="/my-reservations" class="nav-link">
      Moje rezervace
    </router-link>

    <router-link v-if="auth.isAdmin" to="/admin" class="nav-link">
      Admin
    </router-link>

    <button v-if="auth.isAuthenticated" @click="auth.logout" class="logout">Odhlásit se</button>

  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-link {
  text-decoration: none;
  color: #667eea;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #764ba2;
}

.nav-link.router-link-active {
  background-color: #667eea;
  color: white;
  font-weight: bold;
}
.logout {
  margin-left: auto;
  font-weight: 500;
  padding: 0.5rem 1rem;
  color: #667eea;
  background-color: white;
  border-radius: 4px;
}
.logout:hover {
  background-color:  #667eea;
  color: white;
}
</style>