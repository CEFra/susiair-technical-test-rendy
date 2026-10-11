import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(AppModule));
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
