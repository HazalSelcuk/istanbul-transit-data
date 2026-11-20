<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const API_URL = "http://localhost:3000";

const dailyData = ref([]);
const lines = ref([]);
const hourlyData = ref([]);

const selectedDate = ref("2024-06-03");
const selectedLine = ref("MARMARAY");

const dailyChartData = computed(() => ({
  labels: dailyData.value.map((row) => row.full_date),
  datasets: [
    {
      label: "Passages",
      data: dailyData.value.map((row) => row.total_passages),
      backgroundColor: "#3b82f6",
    },
  ],
}));

const hourlyChartData = computed(() => ({
  labels: hourlyData.value.map((row) => row.transition_hour + ":00"),
  datasets: [
    {
      label: "Passages",
      data: hourlyData.value.map((row) => row.total_passages),
      backgroundColor: "#f97316",
    },
  ],
}));

async function loadHourly() {
  const params = new URLSearchParams({ date: selectedDate.value, line: selectedLine.value });
  const response = await fetch(API_URL + "/api/hourly?" + params);
  hourlyData.value = await response.json();
}

onMounted(async () => {
  const dailyResponse = await fetch(API_URL + "/api/daily");
  dailyData.value = await dailyResponse.json();

  const linesResponse = await fetch(API_URL + "/api/lines");
  lines.value = await linesResponse.json();

  await loadHourly();
});

watch([selectedDate, selectedLine], loadHourly);
</script>

<template>
  <main>
    <h1>Istanbul Transit Dashboard</h1>

    <h2>Daily passages (June 1-9, 2024)</h2>
    <div class="chart">
      <Bar :data="dailyChartData" />
    </div>

    <h2>Hourly passages</h2>
    <div class="filters">
      <label>
        Date
        <select v-model="selectedDate">
          <option v-for="row in dailyData" :key="row.full_date" :value="row.full_date">
            {{ row.full_date }} ({{ row.day_name }})
          </option>
        </select>
      </label>
      <label>
        Line
        <select v-model="selectedLine">
          <option v-for="line in lines" :key="line.line_name" :value="line.line_name">
            {{ line.line_name }}
          </option>
        </select>
      </label>
    </div>
    <div class="chart">
      <Bar :data="hourlyChartData" />
    </div>
  </main>
</template>

<style>
.chart {
  max-width: 800px;
  margin-bottom: 32px;
}
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
select {
  margin-left: 8px;
  padding: 4px;
}
</style>