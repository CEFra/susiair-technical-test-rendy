import { Controller, Get, Query } from '@nestjs/common';
import { FlightHoursService } from './flight-hours.service.js';
import {
  GetFlightHoursDto,
  GetFlightHoursSummaryDto,
} from './flight-hours.dto.js';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  getFlightHours(@Query() query: GetFlightHoursDto) {
    return this.flightHoursService.getFlightHours(query.from, query.to);
  }

  @Get('summary')
  getSummary(@Query() query: GetFlightHoursSummaryDto) {
    return this.flightHoursService.getSummary(query.range);
  }
}
