<script setup>
import { ref } from 'vue'
import ReturnVehicleModal from '@/components/reservation/ReturnVehicleModal.vue'

const reservations = ref([
  {
    id: 1,
    vehicle: 'Škoda Octavia',
    start_km: 120345,
  },
])

const selectedReservation = ref(null)
</script>

<template>
  <h1>Moje rezervace</h1>

  <div v-if="!reservations.length" class="no-reservations">
    Nemáte žádné aktivní rezervace.
  </div>

  <div v-else class="reservations-list">
    <div v-for="r in reservations" :key="r.id" class="reservation-card">
      <h3>{{ r.vehicle }}</h3>
      <p><strong>Počáteční km:</strong> {{ r.start_km }}</p>
      <button class="btn btn-primary" @click="selectedReservation = r">Vrátit vozidlo</button>
    </div>
  </div>

  <ReturnVehicleModal
    v-if="selectedReservation"
    :reservation="selectedReservation"
    @close="selectedReservation = null"
  />
</template>

<style scoped>
.no-reservations {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.reservations-list {
  display: grid;
  gap: 1rem;
}

.reservation-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reservation-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.reservation-card p {
  margin: 0.5rem 0 1rem 0;
  color: #666;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #dc3545;
  color: white;
}

.btn-primary:hover {
  background-color: #c82333;
}
</style>