<template>
  <div class="logbook-page">
    <header class="header">
      <h1 class="title">Flight Logbook</h1>
      <p class="subtitle">Historical flight recordings & sectors</p>
    </header>

    <div class="card placeholder-card">
      <div class="icon-circle">
        <BookOpen :size="32" class="placeholder-icon" />
      </div>
      <h2 class="card-heading">Logbook History</h2>
      <p class="card-desc">Detailed sector logs and air time records are undergoing operational integration.</p>
      <div class="status-chip">
        <Clock :size="12" />
        <span>Coming Soon in Next Release</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Clock } from 'lucide-vue-next';
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.logbook-page {
  padding: 20px 16px 28px 16px;
}

.header {
  margin-bottom: 24px;

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

.placeholder-card {
  padding: 44px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background-color: rgba(14, 33, 56, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;

    .placeholder-icon {
      color: $primary-navy;
    }
  }

  .card-heading {
    font-size: 18px;
    font-weight: 800;
    color: $primary-navy;
    margin-bottom: 8px;
  }

  .card-desc {
    font-size: 13.5px;
    color: $text-secondary;
    line-height: 1.5;
    max-width: 320px;
    margin-bottom: 20px;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(14, 33, 56, 0.06);
    color: $primary-navy;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
