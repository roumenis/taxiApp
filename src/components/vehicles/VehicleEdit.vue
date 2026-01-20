<script>
import { ref, watch } from 'vue'

export default {
  name: 'VehicleEdit',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    vehicle: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      fuel_type: '',
      motorization: '',
      license_plate: '',
      current_km: 0,
      reservations: []
    })

    const isEditMode = ref(false)

    // Sleduj otevření/zavření modalu a naplň formulář
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        if (props.vehicle) {
          isEditMode.value = true
          form.value = { ...props.vehicle }
        } else {
          isEditMode.value = false
          resetForm()
        }
      }
    })

    const resetForm = () => {
      form.value = {
        name: '',
        fuel_type: '',
        motorization: '',
        license_plate: '',
        current_km: 0,
        reservations: []
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const save = () => {
      if (!form.value.name || !form.value.license_plate) {
        alert('Vyplňte povinná pole: Název a SPZ')
        return
      }

      const vehicleData = {
        ...form.value,
        current_km: parseInt(form.value.current_km) || 0
      }

      emit('save', vehicleData)
    }

    return {
      form,
      isEditMode,
      closeModal,
      save
    }
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Upravit auto' : 'Přidat nové auto' }}</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="name">Název auta *</label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            placeholder="Např. Škoda Octavia"
          >
        </div>

        <div class="form-group">
          <label for="license_plate">SPZ (Poznávací značka) *</label>
          <input 
            id="license_plate" 
            v-model="form.license_plate" 
            type="text" 
            placeholder="Např. 1AB 2345"
          >
        </div>

        <div class="form-group">
          <label for="motorization">Motorizace</label>
          <input 
            id="motorization" 
            v-model="form.motorization" 
            type="text" 
            placeholder="Např. 1.0 TSI 81 kW"
          >
        </div>

        <div class="form-group">
          <label for="fuel_type">Typ paliva</label>
          <select id="fuel_type" v-model="form.fuel_type">
            <option value="">Vyberte typ paliva</option>
            <option value="Petrol">Benzín</option>
            <option value="Diesel">Nafta</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Elektro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="current_km">Aktuální km</label>
          <input 
            id="current_km" 
            v-model="form.current_km" 
            type="number" 
            placeholder="0"
          >
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">Zrušit</button>
        <button class="btn btn-primary" @click="save">
          {{ isEditMode ? 'Uložit změny' : 'Přidat auto' }}
        </button>
      </div>
    </div>
  </div>
</template>



<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 18px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  background-color: #999;
  color: white;
}

.btn-secondary:hover {
  background-color: #777;
}
</style>
