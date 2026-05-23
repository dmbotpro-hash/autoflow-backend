import { Injectable, Logger, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');
  private connected = false;

  async onModuleInit() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      this.logger.error('DATABASE_URL is not configured. Database features will stay unavailable.');
      return;
    }

    try {
      await this.$connect();
      this.connected = true;
      this.logger.log(`Database connected successfully (${this.getDatabaseHost() ?? 'unknown-host'})`);
    } catch (error) {
      this.connected = false;
      this.logger.error(
        `Failed to connect to database (${this.getDatabaseHost() ?? 'unknown-host'}): ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.connected = false;
      this.logger.log('Database disconnected');
    } catch (error) {
      this.logger.error(
        `Error disconnecting from database: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  isConnected() {
    return this.connected;
  }

  getDatabaseHost() {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return null;
      }

      return new URL(databaseUrl).host;
    } catch {
      return null;
    }
  }

  assertDatabaseAvailable() {
    if (!this.connected) {
      throw new ServiceUnavailableException('Database is unavailable. Please try again shortly.');
    }
  }
}
