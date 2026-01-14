<script setup>
import VehicleCard from './VehicleCard.vue'

defineProps({
  vehicles: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div v-if="!vehicles.length">
    Žádná dostupná vozidla
  </div>

  <div class="vehicle-list">
    <VehicleCard
      v-for="vehicle in vehicles"
      :key="vehicle.id"
      :vehicle="vehicle"
    />
  </div>
</template>
