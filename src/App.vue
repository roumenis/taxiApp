<script setup>
  import Nav from '@/components/Nav.vue';
</script>

<template>
  <div class="app">
    <header>
      <h1>Flotila Taxi-Pablo rezervační systém</h1>
    </header>
    <Nav />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

header {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  font-weight: 300;
}

main {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

h1, h2, h3 {
  margin-bottom: 1rem;
  color: #333;
}

button {
  cursor: pointer;
  transition: all 0.2s;
}

input, button {
  font-family: inherit;
}
</style>