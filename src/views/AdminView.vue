<script>
import { ref, onMounted } from 'vue'
import VehicleEdit from '../components/vehicles/VehicleEdit.vue'
import { useVehicles } from '../composables/useVehicles'

export default {
  name: 'AdminView',
  components: {
    VehicleEdit
  },
  setup() {
    const vehiclesComposable = useVehicles()
    const showEditModal = ref(false)
    const selectedVehicle = ref(null)

    onMounted(() => {
      vehiclesComposable.loadVehicles()
    })

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
      showEditModal,
      selectedVehicle,
      openAddModal,
      openEditModal,
      closeEditModal,
      saveVehicle,
      deleteVehicle
    }
  }
}
</script>

<template>
  <div class="admin-container">
    <div class="header">
      <h1>Správa flotily</h1>
      <button class="btn btn-primary" @click="openAddModal">+ Přidat auto</button>
    </div>

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

    <!-- Modal komponenta pro přidání/úpravu auta -->
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

.license-plate {
  background-color: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.vehicle-details {
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

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}
</style>