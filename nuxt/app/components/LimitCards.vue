<template>
  <div class="cards-grid">
    <div class="limit-card card" v-for="(limit, key) in currentSums" :key="key">
      <div class="card-head">
        <span class="card-title">{{ formatKey(key) }}</span>
        <span class="limit-ratio">{{ getDisplayPercentage(limit.hours, limit.limit) }}%</span>
      </div>
      <div class="card-value">
        {{ limit.hours }} <span class="card-limit">/ {{ limit.limit }}h</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ 
            width: getBarPercentage(limit.hours, limit.limit) + '%', 
            backgroundColor: getProgressColor(limit.hours, limit.limit) 
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentSums: {
    type: Object,
    default: () => ({})
  }
});

const STATUS_COLORS = {
  DANGER: '#E63757',
  WARNING: '#F59E0B',
  SAFE: '#1FBF8F'
};

const formatKey = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const getDisplayPercentage = (hours, limit) => {
  if (!limit) return 0;
  return Math.round((hours / limit) * 100);
};

const getBarPercentage = (hours, limit) => {
  if (!limit) return 0;
  return Math.min(100, Math.max(0, (hours / limit) * 100));
};

const getProgressColor = (hours, limit) => {
  if (!limit) return STATUS_COLORS.SAFE;
  const pct = hours / limit;
  if (pct > 0.9) return STATUS_COLORS.DANGER;
  if (pct > 0.75) return STATUS_COLORS.WARNING;
  return STATUS_COLORS.SAFE;
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;

  .limit-card {
    padding: 14px;

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .card-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: $text-secondary;
      }

      .limit-ratio {
        font-size: 11px;
        font-weight: 700;
        color: $primary-navy;
      }
    }

    .card-value {
      font-size: 20px;
      font-weight: 800;
      color: $primary-navy;
      margin-bottom: 10px;

      .card-limit {
        font-size: 12px;
        font-weight: 500;
        color: $text-secondary;
      }
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background-color: #E5E7EB;
      border-radius: 9999px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 0.4s ease, background-color 0.3s ease;
      }
    }
  }
}
</style>
