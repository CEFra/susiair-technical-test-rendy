import { IsDateString, IsIn, IsNotEmpty, Matches } from 'class-validator';
import type { SummaryRange } from './flight-hours.service.js';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class GetFlightHoursDto {
  @IsNotEmpty()
  @Matches(ISO_DATE, { message: 'from must be in YYYY-MM-DD format' })
  @IsDateString({ strict: true }, { message: 'from must be a valid date' })
  from!: string;

  @IsNotEmpty()
  @Matches(ISO_DATE, { message: 'to must be in YYYY-MM-DD format' })
  @IsDateString({ strict: true }, { message: 'to must be a valid date' })
  to!: string;
}

export class GetFlightHoursSummaryDto {
  @IsNotEmpty()
  @IsIn(['1w', '1m', '3m', '6m', '1y'], {
    message: 'range must be one of: 1w, 1m, 3m, 6m, 1y',
  })
  range!: SummaryRange;
}
