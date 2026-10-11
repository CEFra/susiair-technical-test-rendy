import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service.js';

@Injectable()
export class PilotService {
  constructor(private readonly dataService: DataService) {}

  getProfile() {
    const { name, totalFlightHours } = this.dataService.flightHoursData.pilot;
    const avatarUrl =
      'https://ui-avatars.com/api/?' +
      new URLSearchParams({
        name,
        background: '0E2138',
        color: 'fff',
        bold: 'true',
      }).toString();

    return { name, totalFlightHours, avatarUrl };
  }
}
