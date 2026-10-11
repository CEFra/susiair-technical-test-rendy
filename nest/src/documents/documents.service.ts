import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service.js';
import { TODAY, diffDays } from '../common/date.util.js';

export type DocumentState = 'safe' | 'soon' | 'expired';

@Injectable()
export class DocumentsService {
  constructor(private readonly dataService: DataService) {}

  getDocuments() {
    const data = this.dataService.documentsData;
    const warningDays: number = data.thresholds.warningDays;

    // Calculate expiry relative to baseline operational date
    return data.documents.map((doc: any) => {
      const daysRemaining = diffDays(TODAY, doc.expiryDate);

      let state: DocumentState = 'safe';
      if (daysRemaining <= 0) {
        state = 'expired';
      } else if (daysRemaining <= warningDays) {
        state = 'soon';
      }

      return { ...doc, daysRemaining, state };
    });
  }
}
