<script setup>

    import { ref, watch } from 'vue';
    import VehicleList from '@/components/vehicles/VehicleList.vue';
    import vehiclesData from '@/data/vehicles.json';

    const today = new Date().toISOString().split('T')[0];
    const dateFrom = ref(today);
    const dateTo = ref(today);

    watch(dateFrom, (newFrom) => {
      if (dateTo.value && dateTo.value < newFrom) {
        dateTo.value = newFrom;
      }
    })

    const vehicles = ref(vehiclesData)

    const search = () => {
        console.log('Vyhledat vozidla', dateFrom.value, dateTo.value)
    }
</script>

<template>
    <h1>Rezervace vozidla</h1>

    <div class="filters">
        <div class="filter-group">
            <label for="dateFrom">Od:</label>
            <input id="dateFrom" 
                   type="date" 
                   v-model="dateFrom"
                   :min="today">
        </div>
        <div class="filter-group">
            <label for="dateTo">Do:</label>
            <input id="dateTo" 
                   type="date" 
                   v-model="dateTo"
                   :min="dateFrom">
        </div>
        <button class="btn btn-primary" @click="search">Vyhledat</button>
    </div>

    <VehicleList :vehicles="vehicles" :date-from="dateFrom" :date-to="dateTo"/>

</template>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  align-items: end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #764ba2;
}
</style>