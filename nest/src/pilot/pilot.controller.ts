import { Controller, Get } from '@nestjs/common';
import { PilotService } from './pilot.service.js';

@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get('me')
  getPilotProfile() {
    return this.pilotService.getProfile();
  }
}
