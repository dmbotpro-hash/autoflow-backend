import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaService } from './prisma/prisma.service';

function buildAllowedOrigins(frontendUrl?: string) {
  const configuredOrigins = [frontendUrl, process.env.FRONTEND_URL]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  const defaults =
    process.env.NODE_ENV === 'production'
      ? ['https://autoflow.vercel.app']
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'];

  return Array.from(new Set([...defaults, ...configuredOrigins]));
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    const config = app.get(ConfigService);
    const prisma = app.get(PrismaService);
    const port = Number(config.get<string>('PORT') || '3001');
    const jwtSecret = config.get<string>('JWT_SECRET');
    const databaseUrl = config.get<string>('DATABASE_URL');
    const frontendUrl = config.get<string>('FRONTEND_URL');
    const allowedOrigins = buildAllowedOrigins(frontendUrl);

    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined. Refusing to start without JWT configuration.');
      process.exit(1);
    }

    if (!databaseUrl) {
      logger.error('DATABASE_URL is not defined. API will start in degraded mode until it is configured.');
    } else {
      logger.log(`DATABASE_URL detected for host ${prisma.getDatabaseHost() ?? 'unknown-host'}`);
    }

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        const isAllowed =
          allowedOrigins.includes(origin) ||
          /^https:\/\/.*\.vercel\.app$/i.test(origin);

        if (isAllowed) {
          return callback(null, true);
        }

        logger.warn(`Blocked CORS origin: ${origin}`);
        return callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    });

    app.use(
      helmet({
        crossOriginOpenerPolicy: { policy: 'unsafe-none' },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );
    app.use(compression());
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(port, '0.0.0.0');

    logger.log(`AutoFlow API running on port ${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);

    if (!prisma.isConnected()) {
      logger.warn('Application started without an active database connection. Auth routes will return 503 until the database is reachable.');
    }
  } catch (error) {
    logger.error(
      `Failed to bootstrap application: ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? error.stack : undefined,
    );
    process.exit(1);
  }
}

void bootstrap();
