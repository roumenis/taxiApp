<script setup>
import VehicleCard from './VehicleCard.vue'
import { computed } from 'vue'

const props = defineProps({
  vehicles: {
    type: Array,
    required: true,
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

// Funkce pro kontrolu dostupnosti vozidla v daném období
const isVehicleAvailable = (vehicle) => {
  if (!props.dateFrom || !props.dateTo) {
    return true // Pokud nejsou vybrány data, zobrazujem všechna jako dostupná
  }

  const checkFrom = new Date(props.dateFrom)
  const checkTo = new Date(props.dateTo)

  // Kontrola jestli se období překrývá s některou rezervací
  return !vehicle.reservations?.some(reservation => {
    const resFrom = new Date(reservation.from)
    const resTo = new Date(reservation.to)
    
    // Pokud se období překrývá, vozidlo není dostupné
    return !(checkTo < resFrom || checkFrom > resTo)
  })
}

// Seřadená vozidla - volná první, zabraná poslední
const sortedVehicles = computed(() => {
  return [...props.vehicles].sort((a, b) => {
    const aAvailable = isVehicleAvailable(a)
    const bAvailable = isVehicleAvailable(b)
    
    // Dostupná vozidla na začátek
    if (aAvailable !== bAvailable) {
      return aAvailable ? -1 : 1
    }
    
    return 0
  })
})
</script>

<template>
  <div v-if="!vehicles.length">
    Žádná dostupná vozidla
  </div>

  <div class="vehicle-list">
    <VehicleCard
      v-for="vehicle in sortedVehicles"
      :key="vehicle.id"
      :vehicle="vehicle"
      :is-available="isVehicleAvailable(vehicle)"
    />
  </div>
</template>

<style scoped>
.vehicle-list {
  display: grid;
  gap: 1.5rem;
}
</style>
