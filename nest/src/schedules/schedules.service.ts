import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service.js';

@Injectable()
export class SchedulesService {
  constructor(private readonly dataService: DataService) {}

  getSchedules(year: string, month: string) {
    const data = this.dataService.schedulesData;
    const prefix = `${year}-${month}-`;

    const filteredSchedules = data.schedules.filter((schedule: any) =>
      schedule.duty_date.startsWith(prefix)
    );

    return {
      legend: data.legend,
      schedules: filteredSchedules,
    };
  }
}
