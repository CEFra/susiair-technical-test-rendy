<template>
  <div class="doc-list">
    <div class="doc-item card" v-for="doc in documents" :key="doc.id">
      <div class="doc-icon-wrap">
        <FileText :size="18" class="doc-icon" />
      </div>
      <div class="doc-info">
        <h3 class="doc-label">{{ doc.label }}</h3>
        <p class="doc-expiry">Expires: {{ formatDate(doc.expiryDate) }}</p>
      </div>
      <div :class="['badge', `badge-${doc.state}`]">
        {{ doc.state.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText } from 'lucide-vue-next';
import { formatDate } from '@/utils/date';

defineProps({
  documents: {
    type: Array,
    default: () => []
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .doc-item {
    display: flex;
    align-items: center;
    padding: 12px 14px;

    .doc-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background-color: rgba(14, 33, 56, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;

      .doc-icon {
        color: $primary-navy;
      }
    }

    .doc-info {
      flex: 1;

      .doc-label {
        font-size: 14px;
        font-weight: 700;
        color: $primary-navy;
        margin-bottom: 2px;
      }

      .doc-expiry {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}
</style>
