<template>
  <div class="legend-card card" v-if="legend && legend.length">
    <div class="legend-header">
      <h3 class="legend-title">Duty Type Legend</h3>
    </div>
    <div class="legend-grid">
      <!-- Explanatory Legend for Today -->
      <div class="legend-item" v-for="item in legend" :key="item.code">
        <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
        <!-- <span class="legend-code">{{ item.code }}</span> -->
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  legend: {
    type: Array,
    default: () => []
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.legend-card {
  padding: 14px 12px;
  width: 100%;
  box-sizing: border-box;

  .legend-header {
    margin-bottom: 12px;

    .legend-title {
      font-size: 12px;
      font-weight: 700;
      color: $primary-navy;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }

  .legend-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;

      &.today-legend-item {
        .legend-code {
          color: $brand-red;
        }
      }

      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .legend-code {
        font-size: 11px;
        font-weight: 800;
        color: $primary-navy;
        min-width: 26px;
        flex-shrink: 0;
      }

      .legend-label {
        font-size: 11px;
        color: $text-secondary;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
