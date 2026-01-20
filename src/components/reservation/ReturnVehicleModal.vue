<script setup>
import { ref } from 'vue'
import { useReservations } from '@/composables/useReservations'

const props = defineProps({
  reservation: Object,
})

const emit = defineEmits(['close', 'completed'])
const endKm = ref('')
const today = new Date().toISOString().split('T')[0]
const returnDate = ref(today)
const reservationsComposable = useReservations()

const confirm = () => {
  if (!endKm.value) {
    alert('Prosím, zadejte aktuální stav km')
    return
  }

  const updated = reservationsComposable.completeReservation(
    props.reservation.id, 
    parseInt(endKm.value),
    returnDate.value
  )
  if (updated) {
    alert('Vozidlo bylo vráceno')
    emit('completed')
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <h3>Vrácení vozidla</h3>

      <p><strong>Vozidlo:</strong> {{ reservation.vehicle }}</p>
      <p><strong>Původně do:</strong> {{ reservation.to }}</p>

      <label for="returnDate">Datum vrácení</label>
      <input 
        id="returnDate" 
        type="date" 
        v-model="returnDate"
        :max="reservation.to"
      />

      <label for="endKm">Aktuální stav km</label>
      <input id="endKm" type="number" v-model="endKm" />

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

.modal-content label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.modal-content input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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