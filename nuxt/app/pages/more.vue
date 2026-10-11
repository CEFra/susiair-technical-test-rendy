<template>
  <div class="more-page">
    <header class="header">
      <h1 class="title">Pilot Profile & More</h1>
      <p class="subtitle">Operational preferences and session controls</p>
    </header>

    <!-- Pilot Profile Card -->
    <div class="card profile-card">
      <div class="avatar-large">
        <img :src="authStore.user?.avatarUrl" alt="Pilot Avatar" v-if="authStore.user?.avatarUrl" />
        <User :size="32" v-else class="user-icon" />
      </div>
      <div class="pilot-details">
        <h2 class="pilot-fullname">{{ authStore.user?.name || 'Pilot' }}</h2>
        <span class="pilot-badge">Susi Air Active Pilot</span>
        <p class="meta-info">Total Flight Hours: <strong>{{ authStore.user?.totalFlightHours || 0 }}h</strong></p>
      </div>
    </div>

    <!-- App Info & System Config -->
    <div class="card info-card">
      <h3 class="card-title">System Information</h3>
      <div class="info-row">
        <span class="label">Release Date</span>
        <span class="value">{{ releaseDate }}</span>
      </div>
      <div class="info-row">
        <span class="label">App Version</span>
        <span class="value">v1.0.0 (Production)</span>
      </div>
      <div class="info-row">
        <span class="label">Airline Division</span>
        <span class="value">PT ASI Pudjiastuti Aviation</span>
      </div>
    </div>

    <!-- Logout Action -->
    <button @click="logout" class="btn-primary logout-btn">
      <LogOut :size="16" />
      <span>Sign Out</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { User, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { APP_REFERENCE_DATE, formatDate } from '@/utils/date';

const authStore = useAuthStore();
const router = useRouter();

const releaseDate = formatDate(APP_REFERENCE_DATE);

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.more-page {
  padding: 20px 16px 28px 16px;
}

.header {
  margin-bottom: 20px;

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

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 18px;
  margin-bottom: 16px;

  .avatar-large {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #FFFFFF;
    box-shadow: 0 4px 10px rgba(14, 33, 56, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F3F4F6;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-icon {
      color: $text-secondary;
    }
  }

  .pilot-details {
    .pilot-fullname {
      font-size: 18px;
      font-weight: 800;
      color: $primary-navy;
      margin-bottom: 2px;
    }

    .pilot-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: #059669;
      background: rgba(31, 191, 143, 0.12);
      padding: 2px 8px;
      border-radius: 9999px;
      margin-bottom: 6px;
    }

    .meta-info {
      font-size: 12px;
      color: $text-secondary;

      strong {
        color: $primary-navy;
        font-weight: 700;
      }
    }
  }
}

.info-card {
  padding: 18px;
  margin-bottom: 24px;

  .card-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $text-secondary;
    margin-bottom: 14px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(229, 231, 235, 0.7);
    font-size: 13px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .label {
      color: $text-secondary;
    }

    .value {
      color: $primary-navy;
      font-weight: 600;
    }
  }
}

.logout-btn {
  width: 100%;
  padding: 13px;
}
</style>
