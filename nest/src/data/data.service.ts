import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Loads the provided mock JSON files into memory once at startup.
 */
@Injectable()
export class DataService implements OnModuleInit {
  private readonly logger = new Logger(DataService.name);

  public flightHoursData: any;
  public documentsData: any;
  public schedulesData: any;

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    const baseDir =
      process.env.DATA_DIR ?? path.dirname(fileURLToPath(import.meta.url));

    const read = (file: string) =>
      JSON.parse(fs.readFileSync(path.join(baseDir, file), 'utf8'));

    try {
      this.flightHoursData = read('mock-flight-hours.json');
      this.documentsData = read('mock-documents.json');
      this.schedulesData = read('mock-schedules.json');
      this.logger.log(`Mock data loaded from ${baseDir}`);
    } catch (error) {
      this.logger.error(`Failed to load mock data from ${baseDir}`);
      throw error;
    }
  }
}
