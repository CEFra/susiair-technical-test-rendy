import { Test } from '@nestjs/testing';
import { DataService } from '../data/data.service.js';
import { DocumentsService } from './documents.service.js';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DataService, DocumentsService],
    }).compile();
    await moduleRef.init();
    service = moduleRef.get(DocumentsService);
  });

  it('computes days remaining and urgency state relative to 15 May 2026', () => {
    const docs = Object.fromEntries(
      service.getDocuments().map((d: any) => [d.id, d]),
    );

    expect(docs.doc_security).toMatchObject({ daysRemaining: -14, state: 'expired' });
    expect(docs.doc_license).toMatchObject({ daysRemaining: 14, state: 'soon' });
    expect(docs.doc_medical).toMatchObject({ daysRemaining: 27, state: 'soon' });
    expect(docs.doc_recurrent).toMatchObject({ state: 'safe' });
    expect(docs.doc_ppc).toMatchObject({ state: 'safe' });
  });
});
