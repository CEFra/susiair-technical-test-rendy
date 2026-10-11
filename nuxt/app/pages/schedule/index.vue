<template>
  <div class="schedule-page">
    <header class="header">
      <div class="header-top">
        <div>
          <h1 class="title">Duty Schedule</h1>
          <p class="subtitle">Operational Flight Roster</p>
        </div>
      </div>
    </header>

    <!-- Monthly Calendar Card Component -->
    <CalendarCard 
      :current-year="currentYear" 
      :current-month="currentMonth" 
      :schedules="schedules" 
      @prev-month="prevMonth" 
      @next-month="nextMonth" 
      @go-to-today="goToToday" 
      @open-detail="openDetail" 
    />

    <!-- Duty Type Legend Component -->
    <DutyLegend :legend="legend" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarDays } from 'lucide-vue-next';
import { useApi } from '@/composables/useApi';
import { APP_REFERENCE_YEAR, APP_REFERENCE_MONTH } from '@/utils/date';

const router = useRouter();
const { fetchWithAuth } = useApi();

const currentYear = ref(APP_REFERENCE_YEAR);
const currentMonth = ref(APP_REFERENCE_MONTH);

const schedules = ref([]);
const legend = ref([]);

const fetchSchedules = async () => {
  try {
    const monthStr = currentMonth.value.toString().padStart(2, '0');
    const res = await fetchWithAuth(`/schedules?year=${currentYear.value}&month=${monthStr}`);
    schedules.value = res.schedules;
    legend.value = res.legend;
  } catch (e) {
    console.error('Failed to fetch schedules', e);
  }
};

onMounted(() => {
  fetchSchedules();
});

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
  fetchSchedules();
};

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
  fetchSchedules();
};

const goToToday = () => {
  currentYear.value = APP_REFERENCE_YEAR;
  currentMonth.value = APP_REFERENCE_MONTH;
  fetchSchedules();
};

const openDetail = (date) => {
  const dateStr = `${currentYear.value}-${currentMonth.value.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
  router.push(`/schedule/${dateStr}`);
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.schedule-page {
  padding: 20px 16px 28px 16px;
  width: 100%;
  box-sizing: border-box;
}

.header {
  margin-bottom: 18px;
  
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    flex-wrap: wrap;

    .today-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #FFFFFF;
      border: 1px solid rgba(230, 55, 87, 0.3);
      box-shadow: 0 2px 6px rgba(230, 55, 87, 0.08);
      border-radius: 9999px;
      padding: 4px 10px;
      font-size: 11.5px;
      color: $brand-red;
      font-weight: 600;

      .pill-icon {
        color: $brand-red;
        flex-shrink: 0;
      }

      strong {
        font-weight: 800;
      }
    }
  }

  .title {
    font-size: 22px;
    font-weight: 800;
    color: $primary-navy;
    margin-bottom: 2px;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 13px;
    color: $text-secondary;
  }
}
</style>
