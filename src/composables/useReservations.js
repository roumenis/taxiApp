import { ref } from 'vue'

const RESERVATIONS_KEY = 'taxi_reservations'
const reservations = ref([])

export const useReservations = () => {
  const loadReservations = () => {
    try {
      const saved = localStorage.getItem(RESERVATIONS_KEY)
      if (saved) {
        reservations.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Chyba při načítání rezervací:', error)
    }
  }

  const saveReservations = () => {
    try {
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations.value))
    } catch (error) {
      console.error('Chyba při ukládání rezervací:', error)
    }
  }

  const addReservation = (reservation) => {
    const newReservation = {
      id: reservations.value.length > 0 ? Math.max(...reservations.value.map(r => r.id)) + 1 : 1,
      ...reservation,
      created_at: new Date().toISOString()
    }
    reservations.value.push(newReservation)
    saveReservations()
    return newReservation
  }

  const getUserReservations = (userId) => {
    return reservations.value.filter(r => r.user_id === userId)
  }

  const completeReservation = (reservationId, endKm, returnDate) => {
    const index = reservations.value.findIndex(r => r.id === reservationId)
    if (index !== -1) {
      reservations.value[index].end_km = endKm
      reservations.value[index].status = 'completed'
      reservations.value[index].to = returnDate
      reservations.value[index].completed_at = new Date().toISOString()
      saveReservations()
      return reservations.value[index]
    }
    return null
  }

  return {
    reservations,
    loadReservations,
    saveReservations,
    addReservation,
    getUserReservations,
    completeReservation
  }
}
