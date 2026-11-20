<script setup>
import { ref, onMounted } from "vue";

const dailyData = ref([]);

onMounted(async () => {
  const response = await fetch("http://localhost:3000/api/daily");
  dailyData.value = await response.json();
});
</script>

<template>
  <main>
    <h1>Istanbul Transit Dashboard</h1>
    <h2>Daily passages (June 1-9, 2024)</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Day</th>
          <th>Passages</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dailyData" :key="row.full_date">
          <td>{{ row.full_date }}</td>
          <td>{{ row.day_name }}</td>
          <td>{{ row.total_passages.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
table {
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 6px 12px;
  text-align: left;
}
</style>
