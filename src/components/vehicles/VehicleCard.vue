<script setup>
    import { ref } from 'vue';
    import ReservationModal from '@/components/reservation/ReservationModal.vue';

    const props = defineProps({
        vehicle: {
            type: Object,
            required: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    });
    const showModal = ref(false); 
</script>

<template>
    <div class="vehicle-card" :class="{ 'vehicle-unavailable': !isAvailable }">
        <h2>{{ vehicle.name }}</h2>
        <div class="vehicle-details">
            <p><strong>SPZ:</strong> {{ vehicle.license_plate }}</p>
            <p><strong>Aktuální stav km:</strong> {{ vehicle.current_km }}</p>
        </div>
        <div v-if="!isAvailable" class="unavailable-badge">
            Vozidlo je v tomto období rezervováno
        </div>
        <button 
            class="btn btn-primary" 
            @click="showModal = true"
            :disabled="!isAvailable"
        >
            {{ isAvailable ? 'Rezervovat' : 'Není dostupné' }}
        </button>

        <ReservationModal
            v-if="showModal"
            :vehicle="vehicle"
            @close="showModal = false"
        />
    </div>
</template>

<style scoped>
.vehicle-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.vehicle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.vehicle-unavailable {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.vehicle-card h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;
}

.vehicle-details {
  margin-bottom: 1.5rem;
}

.vehicle-details p {
  margin: 0.5rem 0;
  color: #666;
}

.unavailable-badge {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
}

.btn-primary {
  background-color: #28a745;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #218838;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.65;
}
</style>
