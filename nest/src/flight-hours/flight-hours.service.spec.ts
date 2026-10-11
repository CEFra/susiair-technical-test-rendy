import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataService } from '../data/data.service.js';
import { FlightHoursService } from './flight-hours.service.js';

describe('FlightHoursService', () => {
  let service: FlightHoursService;
  let data: DataService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DataService, FlightHoursService],
    }).compile();
    await moduleRef.init(); // triggers DataService.onModuleInit (loads JSON)

    service = moduleRef.get(FlightHoursService);
    data = moduleRef.get(DataService);
  });

  describe('calculateRollingHours', () => {
    const map = new Map<string, number>([
      ['2026-01-01', 2],
      ['2026-01-02', 0],
      // 2026-01-03 missing on purpose
      ['2026-01-04', 3.5],
    ]);

    it('sums the target day and the previous windowDays - 1 days', () => {
      expect(service.calculateRollingHours('2026-01-04', 4, map)).toBe(5.5);
      expect(service.calculateRollingHours('2026-01-04', 2, map)).toBe(3.5);
    });

    it('treats missing dates and dates before the dataset as 0', () => {
      expect(service.calculateRollingHours('2026-01-03', 1, map)).toBe(0);
      expect(service.calculateRollingHours('2026-01-01', 30, map)).toBe(2);
    });

    it('rounds to one decimal place', () => {
      const m = new Map([
        ['2026-01-01', 0.1],
        ['2026-01-02', 0.2],
      ]);
      expect(service.calculateRollingHours('2026-01-02', 2, m)).toBe(0.3);
    });
  });

  describe('getSummary', () => {
    it('returns card sums for today (15 May 2026) against the limits', () => {
      const { today, currentSums } = service.getSummary('1w');
      expect(today).toBe('2026-05-15');
      expect(currentSums.daily).toMatchObject({ hours: 6.4, limit: 8 });
      expect(currentSums.weekly).toMatchObject({ hours: 25.2, limit: 40 });
      expect(currentSums.monthly).toMatchObject({ hours: 87.2, limit: 100 });
      expect(currentSums.annual).toMatchObject({ hours: 1013.8, limit: 1050 });
    });

    it('returns 15 points with today centered', () => {
      const { chart } = service.getSummary('1w');
      expect(chart.data).toHaveLength(15);
      expect(chart.data[0].date).toBe('2026-05-08');
      expect(chart.data[7]).toMatchObject({ date: '2026-05-15', isToday: true });
      expect(chart.data[14].date).toBe('2026-05-22');
    });

    it.each([
      ['1w', 7, 40, 45],
      ['1m', 30, 100, 125],
      ['3m', 90, 300, 325],
      ['6m', 180, 600, 625],
      ['1y', 365, 1050, 1200],
    ] as const)(
      '%s uses a %i-day window, limit %i and Y max %i',
      (range, windowDays, limit, max) => {
        const { chart } = service.getSummary(range);
        expect(chart).toMatchObject({ windowDays, limit, max });
      },
    );

    it('ignores dataset entries after today (they have not been flown yet)', () => {
      const points = service.getSummary('1w').chart.data;
      const byDate = Object.fromEntries(points.map((p) => [p.date, p]));
      expect(byDate['2026-05-21'].rollingSum).toBe(6.4);
      expect(byDate['2026-05-22'].rollingSum).toBe(0);
      expect(byDate['2026-05-22'].isFuture).toBe(true);
    });

    it('matches a brute-force rolling sum for past dates', () => {
      const raw: { date: string; hours: number }[] =
        data.flightHoursData.flightHours;
      const { chart } = service.getSummary('1m');
      for (const point of chart.data.filter((p) => !p.isFuture)) {
        const end = Date.parse(point.date);
        const start = end - 29 * 86_400_000;
        const expected = raw
          .filter((e) => {
            const t = Date.parse(e.date);
            return t >= start && t <= end;
          })
          .reduce((s, e) => s + e.hours, 0);
        expect(point.rollingSum).toBeCloseTo(expected, 1);
      }
    });
  });

  describe('getFlightHours', () => {
    it('returns one entry per day in the inclusive range', () => {
      const result = service.getFlightHours('2026-05-10', '2026-05-12');
      expect(result).toEqual([
        { date: '2026-05-10', hours: 1.6 },
        { date: '2026-05-11', hours: 0 },
        { date: '2026-05-12', hours: 4.6 },
      ]);
    });

    it('fills dates outside the dataset with 0', () => {
      const result = service.getFlightHours('2024-12-26', '2024-12-27');
      expect(result).toEqual([
        { date: '2024-12-26', hours: 0 },
        { date: '2024-12-27', hours: 5.7 },
      ]);
    });

    it('rejects from > to and oversized ranges', () => {
      expect(() => service.getFlightHours('2026-05-12', '2026-05-10')).toThrow(
        BadRequestException,
      );
      expect(() => service.getFlightHours('2000-01-01', '2026-01-01')).toThrow(
        BadRequestException,
      );
    });
  });
});
