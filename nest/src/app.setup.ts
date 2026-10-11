import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Global app configuration shared by main.ts and the e2e tests, so tests run
 * against exactly the same pipes/CORS setup as production.
 * The global guard and exception filter are registered in AppModule.
 */
export function configureApp(app: INestApplication): INestApplication {
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}
