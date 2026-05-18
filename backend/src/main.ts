import { NestFactory } from '@nestjs/core'; // <-- Yahan 'I' small kar diya hai
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Bulletproof CORS Configuration for production & testing
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = Number(config.get<number>('PORT') ?? 3001);

  // Global prefix hataya ya lagaya aapke routing par depend karta hai.
  // app.setGlobalPrefix('api');

  // Security headers configured safely to allow Cross-Origin isolation
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'unsafe-none' }, 
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

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