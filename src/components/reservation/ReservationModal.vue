<script setup>
import { useReservations } from '@/composables/useReservations'
import { useAuth } from '@/stores/auth'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  dateFrom: {
    type: String,
    default: ''
  },
  dateTo: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const auth = useAuth()
const reservationsComposable = useReservations()

const confirm = () => {
  if (auth.user && props.vehicle) {
    const reservation = {
      user_id: auth.user.id,
      vehicle_id: props.vehicle.id,
      from: props.dateFrom,
      to: props.dateTo,
      start_km: props.vehicle.current_km,
      status: 'active'
    }
    
    reservationsComposable.addReservation(reservation)
    alert('Rezervace potvrzena! Vozidlo je nyní v "Moje rezervace".')
    emit('close')
  } else {
    alert('Chyba: Chybí data pro vytvoření rezervace.')
  }
}
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <h3>Potvrzení rezervace vozidla</h3>
      <p v-if="vehicle"><strong>Vozidlo:</strong> {{ vehicle.name }} ({{ vehicle.fuel_type }})</p>
      <p v-if="vehicle"><strong>Motorizace:</strong> {{ vehicle.motorization }}</p>
      <p v-if="vehicle"><strong>SPZ:</strong> {{ vehicle.license_plate }}</p>
      <p v-if="vehicle"><strong>Aktuální km:</strong> {{ vehicle.current_km }}</p>
      <p v-if="dateFrom"><strong>Rezervace od:</strong> {{ dateFrom }}</p>
      <p v-if="dateTo"><strong>Rezervace do:</strong> {{ dateTo }}</p>

      <div class="modal-buttons">
        <button class="btn btn-primary" @click="confirm">Potvrdit</button>
        <button class="btn btn-secondary" @click="emit('close')">Zrušit</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content p {
  margin: 1rem 0;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>