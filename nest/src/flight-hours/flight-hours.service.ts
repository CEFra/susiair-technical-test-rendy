import { BadRequestException, Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service.js';
import { TODAY, addDays, diffDays } from '../common/date.util.js';

export type SummaryRange = '1w' | '1m' | '3m' | '6m' | '1y';

/** Days shown on each side of today in the trend chart. */
const CHART_SIDE_DAYS = 7;
/** Upper bound for flight-hours ranges to keep responses small. */
const MAX_RANGE_DAYS = 731;

@Injectable()
export class FlightHoursService {
  constructor(private readonly dataService: DataService) {}

  /**
   * Daily flight hours for every day in [from, to] (inclusive).
   * Days without an entry are returned with 0 hours instead of being skipped.
   */
  getFlightHours(from: string, to: string) {
    const days = diffDays(from, to);
    if (days < 0) {
      throw new BadRequestException('from must not be after to');
    }
    if (days >= MAX_RANGE_DAYS) {
      throw new BadRequestException(
        `range must not exceed ${MAX_RANGE_DAYS} days`,
      );
    }

    const hoursByDate = this.buildHoursMap();
    const result: { date: string; hours: number }[] = [];
    for (let i = 0; i <= days; i++) {
      const date = addDays(from, i);
      result.push({ date, hours: hoursByDate.get(date) ?? 0 });
    }
    return result;
  }

  getSummary(range: SummaryRange) {
    const data = this.dataService.flightHoursData;
    const bounds = data.chartBounds[range];
    const limits = data.limits;

    // Only hours flown up to and including today count. Entries after today in 
    // the dataset have not happened yet, so they are ignored.
    const flownHours = this.buildHoursMap(TODAY);

    const card = (windowDays: number, limit: number) => ({
      hours: this.calculateRollingHours(TODAY, windowDays, flownHours),
      limit,
      windowDays,
    });

    const chartData = [];

    let currentWindowSum = this.calculateRollingHours(
      addDays(TODAY, -CHART_SIDE_DAYS),
      bounds.windowDays,
      flownHours,
    );

    for (let i = -CHART_SIDE_DAYS; i <= CHART_SIDE_DAYS; i++) {
      const dateKey = addDays(TODAY, i);
      const rounded = Math.round(currentWindowSum * 10) / 10;
      
      chartData.push({
        date: dateKey,
        rollingSum: rounded === 0 ? 0 : rounded,
        isToday: i === 0,
        isFuture: i > 0,
      });

      if (i < CHART_SIDE_DAYS) {
        const oldestDateKey = addDays(TODAY, i - bounds.windowDays + 1);
        currentWindowSum -= flownHours.get(oldestDateKey) ?? 0;

        const nextDateKey = addDays(TODAY, i + 1);
        currentWindowSum += flownHours.get(nextDateKey) ?? 0;
      }
    }

    return {
      today: TODAY,
      currentSums: {
        daily: card(1, limits.daily),
        weekly: card(7, limits.weekly),
        monthly: card(30, limits.monthly),
        annual: card(365, limits.annual),
      },
      chart: {
        range,
        windowDays: bounds.windowDays,
        limit: bounds.limit,
        max: bounds.max,
        data: chartData,
      },
    };
  }

  /**
   * Calculates rolling sum for a target date over a given window of days.
   * Days with missing entries contribute 0 hours.
   */
  calculateRollingHours(
    targetDate: string,
    windowDays: number,
    hoursByDate: Map<string, number>,
  ): number {
    let total = 0;
    
    for (let i = 0; i < windowDays; i++) {
      const dateKey = addDays(targetDate, -i);
      total += hoursByDate.get(dateKey) ?? 0;
    }
    const rounded = Math.round(total * 10) / 10;
    return rounded === 0 ? 0 : rounded;
  }

  private buildHoursMap(until?: string): Map<string, number> {
    const map = new Map<string, number>();
    for (const entry of this.dataService.flightHoursData.flightHours) {
      if (until && entry.date > until) continue;
      map.set(entry.date, entry.hours);
    }
    return map;
  }
}
