<template>
  <div class="calendar-card card">
    <div class="calendar-header">
      <button class="nav-btn" @click="$emit('prevMonth')" aria-label="Previous Month">
        <ChevronLeft :size="18" />
      </button>
      <div class="current-month-wrap">
        <h2 class="current-month">{{ currentMonthName }}</h2>
        <span class="current-year">{{ currentYear }}</span>
      </div>
      <button class="nav-btn" @click="$emit('nextMonth')" aria-label="Next Month">
        <ChevronRight :size="18" />
      </button>
    </div>

    <!-- Quick indicator of Today's date -->
    <div class="calendar-subbar">
      <div class="today-hint">
        <span class="today-circle-sample">15</span>
        <span class="hint-text">Current Date: <strong>15 May 2026</strong></span>
      </div>
      <button 
        v-if="currentYear !== APP_REFERENCE_YEAR || currentMonth !== APP_REFERENCE_MONTH" 
        class="jump-today-btn" 
        @click="$emit('goToToday')"
      >
        <RotateCcw :size="12" />
        <span>To Today</span>
      </button>
    </div>

    <div class="calendar-grid">
      <div class="weekday" v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">
        {{ day }}
      </div>
      
      <!-- Empty cells for leading padding -->
      <div class="day-cell empty" v-for="empty in firstDayOfMonth" :key="'empty-'+empty"></div>
      
      <!-- Days of the month -->
      <div 
        class="day-cell" 
        v-for="date in daysInMonth" 
        :key="date"
        :style="getDayStyle(date)"
        @click="$emit('openDetail', date)"
      >
        <div class="day-head">
          <span class="date-num" :class="{ 'today-circle': isToday(date) }">{{ date }}</span>
          <div class="duty-badge-wrap" v-if="getSchedule(date)">
            <div v-if="isComplete(getSchedule(date))" class="status-badge complete" title="Duties Completed">
              <Check :size="8.5" :stroke-width="3" />
            </div>
            <div v-else class="status-badge pending" title="Remaining Duties">
              {{ getRemaining(getSchedule(date)) }}
            </div>
          </div>
        </div>
        
        <div class="duty-info" v-if="getSchedule(date)">
          <span class="base-name">{{ getSchedule(date).base_name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, Check, RotateCcw } from 'lucide-vue-next';
import { 
  getMonthName, 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  APP_REFERENCE_YEAR, 
  APP_REFERENCE_MONTH, 
  isReferenceDate 
} from '@/utils/date';

const props = defineProps({
  currentYear: {
    type: Number,
    required: true
  },
  currentMonth: {
    type: Number,
    required: true
  },
  schedules: {
    type: Array,
    default: () => []
  }
});

defineEmits(['prevMonth', 'nextMonth', 'goToToday', 'openDetail']);

const currentMonthName = computed(() => getMonthName(props.currentYear, props.currentMonth));
const daysInMonth = computed(() => getDaysInMonth(props.currentYear, props.currentMonth));
const firstDayOfMonth = computed(() => getFirstDayOfMonth(props.currentYear, props.currentMonth));

const getFormattedDateStr = (date) => {
  return `${props.currentYear}-${props.currentMonth.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
};

const isToday = (date) => {
  return isReferenceDate(props.currentYear, props.currentMonth, date);
};

const scheduleMap = computed(() => {
  return props.schedules.reduce((map, s) => {
    map[s.duty_date] = s;
    return map;
  }, {});
});

const getSchedule = (date) => {
  const dateStr = getFormattedDateStr(date);
  return scheduleMap.value[dateStr];
};

const getDayStyle = (date) => {
  const s = getSchedule(date);
  if (!s) return {};
  return {
    backgroundColor: `${s.base_color}18`,
    borderColor: `${s.base_color}55`,
    borderLeftWidth: '2px',
    borderLeftColor: s.base_color
  };
};

const isComplete = (schedule) => {
  return schedule.count_logbooks === schedule.count_schedules;
};

const getRemaining = (schedule) => {
  return schedule.count_schedules - schedule.count_logbooks;
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.calendar-card {
  padding: 14px 8px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;

  .current-month-wrap {
    text-align: center;

    .current-month {
      font-size: 17px;
      font-weight: 800;
      color: $primary-navy;
      margin-bottom: 2px;
    }

    .current-year {
      font-size: 12px;
      font-weight: 600;
      color: $text-secondary;
    }
  }

  .nav-btn {
    background: #F3F4F6;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $primary-navy;
    transition: background-color 0.2s ease, transform 0.15s ease;

    &:hover {
      background: #E5E7EB;
    }

    &:active {
      transform: scale(0.92);
    }
  }
}

.calendar-subbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F8FAFC;
  border: 1px solid #EEF2F6;
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 12px;

  .today-hint {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    color: $primary-navy;

    .hint-text {
      strong {
        color: $brand-red;
      }
    }
  }

  .jump-today-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 9999px;
    padding: 3px 8px;
    font-size: 10.5px;
    font-weight: 700;
    color: $primary-navy;
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.1s ease;

    &:hover {
      background: #F1F5F9;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  width: 100%;
  box-sizing: border-box;

  .weekday {
    text-align: center;
    font-size: 10.5px;
    font-weight: 700;
    color: $text-secondary;
    padding-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .day-cell {
    aspect-ratio: 1;
    min-width: 0;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
    background-color: #FFFFFF;
    padding: 3px 2px 2px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    @media (min-width: 768px) {
      aspect-ratio: auto;
      min-height: 56px;
      padding: 5px 4px;
    }

    &:hover {
      box-shadow: 0 2px 6px rgba(14, 33, 56, 0.08);
    }

    &:active {
      transform: scale(0.94);
    }

    &.empty {
      border: none;
      background: none;
      cursor: default;
      box-shadow: none;

      &:hover, &:active {
        transform: none;
      }
    }

    .day-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      min-width: 0;
      line-height: 1;

      .date-num {
        font-size: 10.5px;
        font-weight: 700;
        color: $primary-navy;
        line-height: 1;
        flex-shrink: 0;

        &.today-circle {
          background-color: $brand-red;
          color: #FFFFFF !important;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
          box-shadow: 0 1px 3px rgba(230, 55, 87, 0.35);
        }
      }

      .duty-badge-wrap {
        flex-shrink: 0;

        .status-badge {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 800;
          line-height: 1;

          &.complete {
            background-color: $success;
            color: #FFFFFF;
          }

          &.pending {
            background-color: $primary-navy;
            color: #FFFFFF;
          }
        }
      }
    }

    .duty-info {
      width: 100%;
      min-width: 0;
      line-height: 1;

      .base-name {
        font-size: 8.5px;
        font-weight: 800;
        color: $primary-navy;
        line-height: 1;
        letter-spacing: -0.02em;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
