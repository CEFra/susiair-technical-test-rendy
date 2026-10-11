import { Module, Global } from '@nestjs/common';
import { DataService } from './data.service.js';

@Global()
@Module({
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
