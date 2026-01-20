<script>
import { ref, onMounted, computed } from 'vue'
import VehicleEdit from '../components/vehicles/VehicleEdit.vue'
import { useVehicles } from '../composables/useVehicles'
import { useReservations } from '../composables/useReservations'
import drivers from '../data/drivers.json'

export default {
  name: 'AdminView',
  components: {
    VehicleEdit
  },
  setup() {
    const vehiclesComposable = useVehicles()
    const reservationsComposable = useReservations()
    const showEditModal = ref(false)
    const selectedVehicle = ref(null)
    const activeTab = ref('vehicles')
    const selectedReservation = ref(null)
    const editingReservation = ref(null)
    const reservationFilter = ref('active')

    onMounted(() => {
      vehiclesComposable.loadVehicles()
      reservationsComposable.loadReservations()
    })

    const allReservations = computed(() => {
      return reservationsComposable.reservations.value.map(res => ({
        ...res,
        vehicle: vehiclesComposable.getVehicleById(res.vehicle_id)
      }))
    })

    const filteredReservations = computed(() => {
      return allReservations.value.filter(r => r.status === reservationFilter.value)
    })

    const getDriverName = (userId) => {
      return drivers.find(d => d.id === userId)?.driver_name || 'Neznámý řidič'
    }

    const deleteReservation = (reservationId) => {
      if (confirm('Opravdu chcete smazat tuto rezervaci?')) {
        const index = reservationsComposable.reservations.value.findIndex(r => r.id === reservationId)
        if (index !== -1) {
          reservationsComposable.reservations.value.splice(index, 1)
          reservationsComposable.saveReservations()
          selectedReservation.value = null
        }
      }
    }

    const editReservation = (reservation) => {
      editingReservation.value = JSON.parse(JSON.stringify(reservation))
    }

    const saveReservation = () => {
      if (editingReservation.value) {
        const index = reservationsComposable.reservations.value.findIndex(r => r.id === editingReservation.value.id)
        if (index !== -1) {
          reservationsComposable.reservations.value[index] = editingReservation.value
          reservationsComposable.saveReservations()
          editingReservation.value = null
        }
      }
    }

    const cancelEdit = () => {
      editingReservation.value = null
    }

    const openAddModal = () => {
      selectedVehicle.value = null
      showEditModal.value = true
    }

    const openEditModal = (vehicle) => {
      selectedVehicle.value = vehicle
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
      selectedVehicle.value = null
    }

    const saveVehicle = (vehicleData) => {
      if (selectedVehicle.value) {
        vehiclesComposable.editVehicle(selectedVehicle.value.id, vehicleData)
      } else {
        vehiclesComposable.addVehicle(vehicleData)
      }
      closeEditModal()
    }

    const deleteVehicle = (vehicleId) => {
      if (confirm('Opravdu chcete smazat toto auto?')) {
        vehiclesComposable.deleteVehicle(vehicleId)
      }
    }

    return {
      vehicles: vehiclesComposable.vehicles,
      reservations: reservationsComposable.reservations,
      allReservations,
      filteredReservations,
      reservationFilter,
      showEditModal,
      selectedVehicle,
      activeTab,
      selectedReservation,
      editingReservation,
      openAddModal,
      openEditModal,
      closeEditModal,
      saveVehicle,
      deleteVehicle,
      deleteReservation,
      editReservation,
      saveReservation,
      cancelEdit,
      getDriverName
    }
  }
}
</script>

<template>
  <div class="admin-container">
    <div class="header">
      <h1>Správa flotily</h1>
      <button class="btn btn-primary" @click="openAddModal" v-if="activeTab === 'vehicles'">+ Přidat auto</button>
    </div>

    <!-- Záložky -->
    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'vehicles' }"
        @click="activeTab = 'vehicles'"
      >
        Vozidla
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'reservations' }"
        @click="activeTab = 'reservations'"
      >
        Rezervace
      </button>
    </div>

    <!-- Tab: Vozidla -->
    <div v-if="activeTab === 'vehicles'" class="tab-content">
      <div class="vehicles-grid">
        <div v-if="vehicles.length === 0" class="empty-state">
          <p>Žádná auta v evidenci</p>
        </div>
        <div v-else v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card">
          <div class="vehicle-header">
            <h2>{{ vehicle.name }}</h2>
            <span class="license-plate">{{ vehicle.license_plate }}</span>
          </div>

          <div class="vehicle-details">
            <div class="detail-item">
              <span class="label">Motorizace:</span>
              <span class="value">{{ vehicle.motorization }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Palivo:</span>
              <span class="value">{{ vehicle.fuel_type }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Aktuální km:</span>
              <span class="value">{{ vehicle.current_km }} km</span>
            </div>
            <div class="detail-item">
              <span class="label">Rezervace:</span>
              <span class="value">{{ vehicle.reservations ? vehicle.reservations.length : 0 }}</span>
            </div>
          </div>

          <div class="vehicle-actions">
            <button class="btn btn-edit" @click="openEditModal(vehicle)">Upravit</button>
            <button class="btn btn-delete" @click="deleteVehicle(vehicle.id)">Smazat</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Rezervace -->
    <div v-if="activeTab === 'reservations'" class="tab-content">
      <!-- Pod-záložky pro Aktivní/Archiv -->
      <div class="sub-tabs">
        <button 
          class="sub-tab-button" 
          :class="{ active: reservationFilter === 'active' }"
          @click="reservationFilter = 'active'"
        >
          Aktivní
        </button>
        <button 
          class="sub-tab-button" 
          :class="{ active: reservationFilter === 'completed' }"
          @click="reservationFilter = 'completed'"
        >
          Archiv
        </button>
      </div>
      <div v-if="editingReservation" class="reservation-edit-form">
        <h3>Úprava rezervace</h3>
        <div class="form-group">
          <label>Vozidlo:</label>
          <input v-model="editingReservation.vehicle_id" type="number" disabled class="form-input disabled">
        </div>
        <div class="form-group">
          <label>Řidič ID:</label>
          <input v-model="editingReservation.user_id" type="number" disabled class="form-input disabled">
        </div>
        <div class="form-group">
          <label>Od:</label>
          <input v-model="editingReservation.from" type="date" class="form-input">
        </div>
        <div class="form-group">
          <label>Do:</label>
          <input v-model="editingReservation.to" type="date" class="form-input">
        </div>
        <div class="form-group">
          <label>Počáteční km:</label>
          <input v-model.number="editingReservation.start_km" type="number" class="form-input">
        </div>
        <div class="form-group">
          <label>Koncové km:</label>
          <input v-model.number="editingReservation.end_km" type="number" class="form-input">
        </div>
        <div class="form-group">
          <label>Status:</label>
          <select v-model="editingReservation.status" class="form-input">
            <option value="active">Aktivní</option>
            <option value="completed">Dokončená</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" @click="saveReservation">Uložit</button>
          <button class="btn btn-secondary" @click="cancelEdit">Zrušit</button>
        </div>
      </div>

      <div v-else class="reservations-grid">
        <div v-if="filteredReservations.length === 0" class="empty-state">
          <p>{{ reservationFilter === 'active' ? 'Žádné aktivní rezervace' : 'Archiv je prázdný' }}</p>
        </div>
        <div v-else v-for="reservation in filteredReservations" :key="reservation.id" class="reservation-card">
          <div class="reservation-header">
            <h2>{{ reservation.vehicle?.name || 'Neznámé vozidlo' }}</h2>
            <span class="status-badge" :class="'status-' + reservation.status">
              {{ reservation.status === 'active' ? 'Aktivní' : 'Dokončená' }}
            </span>
          </div>

          <div class="reservation-details">
            <div class="detail-item">
              <span class="label">Řidič:</span>
              <span class="value">{{ getDriverName(reservation.user_id) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">SPZ:</span>
              <span class="value">{{ reservation.vehicle?.license_plate || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Od:</span>
              <span class="value">{{ reservation.from }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Do:</span>
              <span class="value">{{ reservation.to }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Počáteční km:</span>
              <span class="value">{{ reservation.start_km }}</span>
            </div>
            <div class="detail-item" v-if="reservation.end_km">
              <span class="label">Koncové km:</span>
              <span class="value">{{ reservation.end_km }}</span>
            </div>
          </div>

          <div class="reservation-actions">
            <button class="btn btn-edit" @click="editReservation(reservation)">Upravit</button>
            <button class="btn btn-delete" @click="deleteReservation(reservation.id)">Smazat</button>
          </div>
        </div>
      </div>
    </div>

    <VehicleEdit 
      :is-open="showEditModal" 
      :vehicle="selectedVehicle"
      @close="closeEditModal"
      @save="saveVehicle"
    />
  </div>
</template>



<style scoped>
.admin-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  bottom: -2px;
}

.tab-button:hover {
  color: #333;
}

.tab-button.active {
  color: #4caf50;
  border-bottom-color: #4caf50;
}

.sub-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-left: 10px;
}

.sub-tab-button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #999;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  bottom: -2px;
}

.sub-tab-button:hover {
  color: #666;
}

.sub-tab-button.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: #757575;
  color: white;
}

.btn-secondary:hover {
  background-color: #616161;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
  flex: 1;
  margin-right: 10px;
}

.btn-edit:hover {
  background-color: #1976d2;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  flex: 1;
}

.btn-delete:hover {
  background-color: #da190b;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.vehicle-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.vehicle-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.reservation-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.reservation-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.vehicle-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reservation-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.license-plate {
  background-color: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.status-active {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status-completed {
  background-color: #bbdefb;
  color: #1565c0;
}

.vehicle-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.reservation-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .label {
  color: #666;
  font-weight: 600;
}

.detail-item .value {
  color: #333;
  text-align: right;
}

.vehicle-actions {
  display: flex;
  gap: 10px;
}

.reservation-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}

.reservation-edit-form {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.reservation-edit-form h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-weight: 600;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.form-input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input.disabled:focus {
  border-color: #ddd;
  box-shadow: none;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.form-actions .btn {
  flex: 0 1 auto;
}
</style>