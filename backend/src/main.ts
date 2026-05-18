import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const config = app.get(ConfigService);

  const port = Number(config.get<number>('PORT') ?? 3001);
  const frontendUrl = config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';

  app.setGlobalPrefix('api');

  // Security headers
  app.use(helmet());

  // Compression
  app.use(compression());

  // Cookie parsing
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  console.log(`✅ AutoFlow API running on port ${port}`);
}

bootstrap();

