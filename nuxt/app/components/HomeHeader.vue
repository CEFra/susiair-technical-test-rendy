<template>
  <header class="home-header">
    <div class="profile-info">
      <div class="greeting-badge">
        <span class="status-indicator"></span>
        <span class="greeting-text">{{ greeting }}</span>
      </div>
      <h1 class="pilot-name">{{ authStore.user?.name || 'Pilot' }}</h1>
      <div class="hours-badge">
        <Plane :size="13" class="plane-icon" />
        <span>Total Hours: <strong>{{ authStore.user?.totalFlightHours || 0 }}h</strong></span>
      </div>
    </div>
    <div class="avatar-wrap">
      <img :src="authStore.user?.avatarUrl" alt="Pilot Avatar" v-if="authStore.user?.avatarUrl" class="avatar-img" />
      <div class="avatar-fallback" v-else>
        <User :size="24" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { Plane, User } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { getCurrentHour } from '@/utils/date';

const authStore = useAuthStore();

const greeting = computed(() => {
  const hour = getCurrentHour();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 4px 0;

  .greeting-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: $success;
    }

    .greeting-text {
      color: $text-secondary;
      font-size: 13px;
      font-weight: 500;
    }
  }

  .pilot-name {
    color: $primary-navy;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .hours-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(14, 33, 56, 0.05);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 12px;
    color: $primary-navy;

    .plane-icon {
      color: $brand-red;
    }

    strong {
      color: $primary-navy;
      font-weight: 700;
    }
  }

  .avatar-wrap {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #FFFFFF;
    box-shadow: 0 4px 10px rgba(14, 33, 56, 0.12);
    background-color: $card-surface;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      color: $text-secondary;
    }
  }
}
</style>
