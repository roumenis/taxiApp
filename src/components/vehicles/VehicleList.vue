<script setup>
import VehicleCard from './VehicleCard.vue'
import { computed } from 'vue'
import { useReservations } from '@/composables/useReservations'

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

const reservationsComposable = useReservations()
reservationsComposable.loadReservations()

// Funkce pro kontrolu dostupnosti vozidla v daném období
const isVehicleAvailable = (vehicle) => {
  if (!props.dateFrom || !props.dateTo) {
    return true 
  }

  const checkFrom = new Date(props.dateFrom)
  const checkTo = new Date(props.dateTo)

  // Kombinuj rezervace z JSON a z localStorage
  const allReservations = [
    ...(vehicle.reservations || []),
    ...reservationsComposable.reservations.value.filter(r => r.vehicle_id === vehicle.id && r.status === 'active')
  ]

  // Kontrola jestli se období překrývá s některou rezervací
  return !allReservations.some(reservation => {
    const resFrom = new Date(reservation.from)
    const resTo = new Date(reservation.to)
    
    // Pokud se období překrývá, vozidlo není dostupné
    // checkTo je poslední den, kdy si vozidlo vezmu, takže pokud resFrom > checkTo, jsou bezpečně oddělené
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
      :date-from="dateFrom"
      :date-to="dateTo"
    />
  </div>
</template>

<style scoped>
.vehicle-list {
  display: grid;
  gap: 1.5rem;
}
</style>
