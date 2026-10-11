<template>
  <div class="chart-container card">
    <div class="chart-top">
      <div class="chart-title-wrap">
        <h3 class="chart-title">Flight Hours Trend</h3>
        <div class="chart-legend">
          <span class="legend-item"><span class="dot actual-dot"></span> Rolling Sum</span>
          <span class="legend-item"><span class="line limit-line"></span> Limit</span>
        </div>
      </div>
      <div class="chart-toggles">
        <button 
          v-for="t in toggles" 
          :key="t" 
          :class="['toggle-btn', { active: activeToggle === t }]"
          @click="$emit('update:activeToggle', t)"
        >
          {{ t }}
        </button>
      </div>
    </div>
    <div class="chart-wrapper">
      <ClientOnly>
        <Line v-if="chartDataConfig" :data="chartDataConfig" :options="chartOptions" />
        <div v-else class="chart-placeholder">Loading chart data...</div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils/date';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  chartApiData: {
    type: Object,
    default: null
  },
  activeToggle: {
    type: String,
    default: '1w'
  }
});

defineEmits(['update:activeToggle']);

const toggles = ['1w', '1m', '3m', '6m', '1y'];

const chartDataConfig = computed(() => {
  if (!props.chartApiData) return null;
  const labels = props.chartApiData.data.map(d => formatDate(d.date).split(' ')[0]);
  const data = props.chartApiData.data.map(d => d.rollingSum);
  const limitLine = props.chartApiData.data.map(() => props.chartApiData.limit);
  
  const pointColors = props.chartApiData.data.map(d => d.isToday ? '#E63757' : '#22C5E8');
  const pointRadii = props.chartApiData.data.map(d => d.isToday ? 5 : 3);

  return {
    labels,
    datasets: [
      {
        label: 'Rolling Sum',
        data,
        borderColor: '#22C5E8',
        backgroundColor: 'rgba(34, 197, 232, 0.1)',
        pointBackgroundColor: pointColors,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: pointRadii,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35
      },
      {
        label: 'Limit',
        data: limitLine,
        borderColor: '#E63757',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0
      }
    ]
  };
});

const chartOptions = computed(() => {
  if (!props.chartApiData || !chartDataConfig.value) return {};
  const dataMax = Math.max(...chartDataConfig.value.datasets[0].data);
  const calculatedMax = Math.max(props.chartApiData.max, dataMax * 1.15);
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0E2138',
        titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
        bodyFont: { family: 'Plus Jakarta Sans' },
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 10 },
          color: '#6B7280'
        }
      },
      y: {
        max: calculatedMax,
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.6)'
        },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 10 },
          color: '#6B7280'
        }
      }
    }
  };
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.chart-container {
  padding: 16px;

  .chart-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .chart-title-wrap {
      .chart-title {
        font-size: 14px;
        color: $primary-navy;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .chart-legend {
        display: flex;
        gap: 10px;
        font-size: 10px;
        color: $text-secondary;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;

          .dot.actual-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: $chart-accent;
          }

          .line.limit-line {
            width: 10px;
            height: 2px;
            background-color: $brand-red;
          }
        }
      }
    }

    .chart-toggles {
      display: flex;
      background: $background;
      padding: 3px;
      border-radius: 9999px;
      gap: 2px;

      .toggle-btn {
        background: transparent;
        border: none;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 700;
        color: $text-secondary;
        border-radius: 9999px;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;

        &.active {
          background: $primary-navy;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(14, 33, 56, 0.2);
        }
      }
    }
  }

  .chart-wrapper {
    height: 190px;
    position: relative;

    @media (min-width: 768px) {
      height: 225px;
    }

    .chart-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: $text-secondary;
      font-size: 13px;
    }
  }
}
</style>
