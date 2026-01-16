import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'taxi_vehicles'
const vehicles = ref([])
const isLoaded = ref(false)

export const useVehicles = () => {
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles.value))
      console.log('Data byla uložena do localStorage')
    } catch (error) {
      console.error('Chyba při ukládání do localStorage:', error)
    }
  }

  const loadVehicles = async () => {
    if (isLoaded.value) return // Už je načteno

    try {
      const savedVehicles = localStorage.getItem(STORAGE_KEY)
      if (savedVehicles) {
        vehicles.value = JSON.parse(savedVehicles)
        console.log('Auta načtena z localStorage')
      } else {
        const response = await fetch('/src/data/vehicles.json')
        vehicles.value = await response.json()
        console.log('Auta načtena z vehicles.json')
        saveToLocalStorage()
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Chyba při načítání aut:', error)
    }
  }

  const getVehicles = () => {
    return vehicles.value
  }

  const getVehicleById = (id) => {
    return vehicles.value.find(v => v.id === id)
  }

  const addVehicle = (vehicleData) => {
    const newVehicle = {
      id: vehicles.value.length > 0 ? Math.max(...vehicles.value.map(v => v.id)) + 1 : 1,
      ...vehicleData,
      reservations: []
    }
    vehicles.value.push(newVehicle)
    saveToLocalStorage()
    console.log('Nové auto bylo přidáno:', newVehicle)
    return newVehicle
  }

  const editVehicle = (vehicleId, vehicleData) => {
    const index = vehicles.value.findIndex(v => v.id === vehicleId)
    if (index !== -1) {
      vehicles.value[index] = {
        id: vehicles.value[index].id,
        ...vehicleData,
        reservations: vehicles.value[index].reservations || []
      }
      saveToLocalStorage()
      console.log('Auto bylo upraveno:', vehicles.value[index])
      return vehicles.value[index]
    }
    return null
  }

  const deleteVehicle = (vehicleId) => {
    const index = vehicles.value.findIndex(v => v.id === vehicleId)
    if (index !== -1) {
      const deleted = vehicles.value[index]
      vehicles.value.splice(index, 1)
      saveToLocalStorage()
      console.log('Auto s ID', vehicleId, 'bylo smazáno')
      return deleted
    }
    return null
  }

  return {
    vehicles,
    isLoaded,
    loadVehicles,
    getVehicles,
    getVehicleById,
    addVehicle,
    editVehicle,
    deleteVehicle
  }
}
