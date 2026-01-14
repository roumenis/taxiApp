<script setup>

    import { ref } from 'vue';
    import VehicleList from '@/components/vehicles/VehicleList.vue';

    const dateFrom = ref('');
    const dateTo = ref('');

    const vehicles = ref([
        {
            id: 1,
            name: 'Škoda Octavia',
            license_plate: '1AB 2345',
            current_km: 120345,
        },
        { 
            id: 2,
            name: 'VW Passat',
            license_plate: '2BC 6789',
            current_km: 98200,
        },
    ])

    const search = () => {
        console.log('Vyhledat vozidla', dateFrom.value, dateTo.value)
    }
</script>

<template>
    <h1>Rezervace vozidla</h1>

    <div class="filters">
        <div class="filter-group">
            <label for="dateFrom">Od:</label>
            <input id="dateFrom" type="date" v-model="dateFrom">
        </div>
        <div class="filter-group">
            <label for="dateTo">Do:</label>
            <input id="dateTo" type="date" v-model="dateTo">
        </div>
        <button class="btn btn-primary" @click="search">Vyhledat</button>
    </div>

    <VehicleList :vehicles="vehicles"/>

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