<template>
  <div class="schedule-detail-page">
    <header class="header">
      <button class="back-btn" @click="goBack" aria-label="Go Back">
        <ArrowLeft :size="18" />
        <span>Back</span>
      </button>
      <h1 class="title">Schedule Details</h1>
    </header>
    
    <div class="card detail-card">
      <div class="icon-circle">
        <CalendarDays :size="28" class="detail-icon" />
      </div>
      <h2 class="detail-date">{{ formattedDate }}</h2>
      <p class="placeholder-text">Detail page coming soon</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { ArrowLeft, CalendarDays } from 'lucide-vue-next';
import { formatDate } from '@/utils/date';

const route = useRoute();
const router = useRouter();

const dateStr = computed(() => String(route.params.date || ''));
const formattedDate = computed(() => {
  return dateStr.value ? formatDate(dateStr.value) : '';
});

const goBack = () => {
  router.push('/schedule');
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.schedule-detail-page {
  padding: 20px 16px 28px 16px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  
  .back-btn {
    background: #FFFFFF;
    border: 1px solid rgba(229, 231, 235, 0.9);
    color: $primary-navy;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 9999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.15s ease, transform 0.15s ease;

    &:hover {
      background-color: #F9FAFB;
    }

    &:active {
      transform: scale(0.95);
    }
  }
  
  .title {
    font-size: 20px;
    font-weight: 800;
    color: $primary-navy;
    margin: 0;
    letter-spacing: -0.01em;
  }
}

.detail-card {
  padding: 40px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(14, 33, 56, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    .detail-icon {
      color: $primary-navy;
    }
  }

  .detail-date {
    color: $primary-navy;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 8px;
  }
  
  .placeholder-text {
    color: $text-secondary;
    font-size: 14px;
  }
}
</style>