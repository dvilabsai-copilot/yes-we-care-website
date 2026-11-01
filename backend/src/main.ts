import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.getHttpAdapter().get('/health', (_req, res: any) => res.json({ ok: true, service: 'ywc-cms' }));
  await app.listen(Number(process.env.PORT || 4102));
}
bootstrap();
