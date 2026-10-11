import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

import { DataModule } from './data/data.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PilotModule } from './pilot/pilot.module.js';
import { FlightHoursModule } from './flight-hours/flight-hours.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { SchedulesModule } from './schedules/schedules.module.js';
import { AuthGuard } from './auth/auth.guard.js';
import { GlobalExceptionFilter } from './global-exception.filter.js';

@Module({
  imports: [
    DataModule,
    AuthModule,
    PilotModule,
    FlightHoursModule,
    DocumentsModule,
    SchedulesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
