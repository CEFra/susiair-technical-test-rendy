<template>
  <div class="home-page">
    <!-- Header: Greeting, Pilot Name, Total Hours, Avatar -->
    <HomeHeader />

    <!-- Hours to Limit Section -->
    <section class="section hours-section">
      <div class="section-header">
        <h2 class="section-title">Hours to Limit</h2>
        <span class="section-subtitle">Duty Regulations</span>
      </div>

      <!-- 4 Limit Summary Cards -->
      <LimitCards :current-sums="currentSums" />

      <!-- Flight Hours Trend Chart -->
      <FlightHoursChart 
        :chart-api-data="chartApiData" 
        :active-toggle="activeToggle" 
        @update:active-toggle="activeToggle = $event" 
      />
    </section>

    <!-- My Documents Section -->
    <section class="section docs-section">
      <div class="section-header">
        <h2 class="section-title">My Documents</h2>
        <span class="doc-count-badge" v-if="documents.length">{{ documents.length }} Verified</span>
      </div>

      <DocumentList :documents="documents" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useApi } from '@/composables/useApi';

const authStore = useAuthStore();
const { fetchWithAuth } = useApi();

const activeToggle = ref('1w');
const currentSums = ref({});
const chartApiData = ref(null);
const documents = ref([]);

const fetchData = async () => {
  try {
    const summary = await fetchWithAuth(`/flight-hours/summary?range=${activeToggle.value}`);
    currentSums.value = summary.currentSums;
    chartApiData.value = summary.chart;
  } catch (e) {
    console.error('Failed to fetch summary', e);
  }
};

const fetchDocs = async () => {
  try {
    const docs = await fetchWithAuth('/documents');
    documents.value = docs;
  } catch (e) {
    console.error('Failed to fetch docs', e);
  }
};

watch(activeToggle, () => {
  fetchData();
});

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchProfile();
  }
  fetchData();
  fetchDocs();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.home-page {
  padding: 20px 16px 28px 16px;
}

.section {
  margin-bottom: 24px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;

    .section-title {
      font-size: 16px;
      color: $primary-navy;
      font-weight: 700;
    }

    .section-subtitle {
      font-size: 12px;
      color: $text-secondary;
      font-weight: 500;
    }

    .doc-count-badge {
      font-size: 11px;
      font-weight: 600;
      color: $primary-navy;
      background: rgba(14, 33, 56, 0.06);
      padding: 2px 8px;
      border-radius: 9999px;
    }
  }
}
</style>
