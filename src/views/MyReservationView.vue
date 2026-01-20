<script setup>
import { ref, onMounted, computed } from 'vue'
import ReturnVehicleModal from '@/components/reservation/ReturnVehicleModal.vue'
import { useReservations } from '@/composables/useReservations'
import { useVehicles } from '@/composables/useVehicles'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const reservationsComposable = useReservations()
const vehiclesComposable = useVehicles()

const selectedReservation = ref(null)

const userReservations = computed(() => {
  const myReservations = reservationsComposable.reservations.value.filter(
    r => r.user_id === auth.user?.id && r.status !== 'completed'
  )
  
  return myReservations.map(reservation => ({
    ...reservation,
    vehicle: vehiclesComposable.getVehicleById(reservation.vehicle_id)
  }))
})

onMounted(() => {
  vehiclesComposable.loadVehicles()
  reservationsComposable.loadReservations()
})

const onReservationCompleted = () => {
  reservationsComposable.loadReservations()
}
</script>

<template>
  <h1>Moje rezervace</h1>

  <div v-if="!userReservations.length" class="no-reservations">
    Nemáte žádné aktivní rezervace.
  </div>

  <div v-else class="reservations-list">
    <div v-for="r in userReservations" :key="r.id" class="reservation-card">
      <h3>{{ r.vehicle?.name || 'Neznámé vozidlo' }}</h3>
      <p v-if="r.vehicle"><strong>Motorizace:</strong> {{ r.vehicle.motorization }}</p>
      <p v-if="r.vehicle"><strong>SPZ:</strong> {{ r.vehicle.license_plate }}</p>
      <p v-if="r.vehicle"><strong>Počáteční km:</strong> {{ r.vehicle.current_km }}</p>
      <p><strong>Rezervace od:</strong> {{ r.from }}</p>
      <p><strong>Rezervace do:</strong> {{ r.to }}</p>
      <button class="btn btn-primary" @click="selectedReservation = r">Vrátit vozidlo</button>
    </div>
  </div>

  <ReturnVehicleModal
    v-if="selectedReservation"
    :reservation="selectedReservation"
    @close="selectedReservation = null"
    @completed="onReservationCompleted"
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