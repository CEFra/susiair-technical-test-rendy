import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('Susi Air Pilot API (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'johndoe', password: 'susiairtest' })
      .expect(200);
    token = res.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => ({ Authorization: `Bearer ${token}` });

  describe('POST /auth/login', () => {
    it('returns a token for the hardcoded pilot', () => {
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('returns 401 with the standard error shape on bad credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'johndoe', password: 'wrong' })
        .expect(401);
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: ['Invalid username or password'],
        path: '/auth/login',
      });
      expect(res.body.timestamp).toBeDefined();
    });

    it('returns 400 when the body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
      expect(Array.isArray(res.body.message)).toBe(true);
    });
  });

  describe('auth guard', () => {
    it.each([
      '/pilot/me',
      '/documents',
      '/flight-hours?from=2026-05-01&to=2026-05-02',
      '/flight-hours/summary?range=1w',
      '/schedules?year=2026&month=05',
    ])('rejects %s without a token', async (url) => {
      await request(app.getHttpServer()).get(url).expect(401);
    });

    it('rejects an invalid token', async () => {
      await request(app.getHttpServer())
        .get('/pilot/me')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });
  });

  it('GET /pilot/me returns name, total hours and avatar URL', async () => {
    const res = await request(app.getHttpServer())
      .get('/pilot/me')
      .set(auth())
      .expect(200);
    expect(res.body).toMatchObject({ name: 'John Doe', totalFlightHours: 1444.5 });
    expect(res.body.avatarUrl).toMatch(/^https:\/\//);
  });

  describe('GET /flight-hours', () => {
    it('returns daily hours in range', async () => {
      const res = await request(app.getHttpServer())
        .get('/flight-hours?from=2026-05-10&to=2026-05-12')
        .set(auth())
        .expect(200);
      expect(res.body).toHaveLength(3);
    });

    it.each([
      'from=2026-13-40&to=2026-05-01',
      'from=2026-05-01',
      'from=2026-05-01T00:00:00Z&to=2026-05-02',
      'from=2026-05-10&to=2026-05-01',
    ])('returns 400 for %s', async (qs) => {
      await request(app.getHttpServer())
        .get(`/flight-hours?${qs}`)
        .set(auth())
        .expect(400);
    });
  });

  describe('GET /flight-hours/summary', () => {
    it('returns cards and a 15-point chart', async () => {
      const res = await request(app.getHttpServer())
        .get('/flight-hours/summary?range=3m')
        .set(auth())
        .expect(200);
      expect(Object.keys(res.body.currentSums)).toEqual([
        'daily',
        'weekly',
        'monthly',
        'annual',
      ]);
      expect(res.body.chart).toMatchObject({ limit: 300, max: 325 });
      expect(res.body.chart.data).toHaveLength(15);
    });

    it('returns 400 for an unknown range', async () => {
      await request(app.getHttpServer())
        .get('/flight-hours/summary?range=2w')
        .set(auth())
        .expect(400);
    });
  });

  it('GET /documents returns documents with expiry state', async () => {
    const res = await request(app.getHttpServer())
      .get('/documents')
      .set(auth())
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const doc of res.body) {
      expect(['safe', 'soon', 'expired']).toContain(doc.state);
      expect(doc.expiryDate).toBeDefined();
    }
  });

  describe('GET /schedules', () => {
    it('returns only entries of the requested month plus the legend', async () => {
      const res = await request(app.getHttpServer())
        .get('/schedules?year=2026&month=05')
        .set(auth())
        .expect(200);
      expect(res.body.legend.length).toBeGreaterThan(0);
      expect(res.body.schedules.length).toBeGreaterThan(0);
      for (const s of res.body.schedules) {
        expect(s.duty_date.startsWith('2026-05-')).toBe(true);
      }
    });

    it.each(['year=2026&month=13', 'year=26&month=05', 'month=05'])(
      'returns 400 for %s',
      async (qs) => {
        await request(app.getHttpServer())
          .get(`/schedules?${qs}`)
          .set(auth())
          .expect(400);
      },
    );
  });
});
