import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { JwtConfig } from './config/jwt.config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { InstagramModule } from './modules/instagram/instagram.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AIModule } from './modules/ai/ai.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { BillingModule } from './modules/billing/billing.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SearchModule } from './modules/search/search.module';
import { SecurityModule } from './modules/security/security.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env', '.env.local'],
      load: [AppConfig, DatabaseConfig, JwtConfig],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    InstagramModule,
    WorkflowsModule,
    MessagesModule,
    AIModule,
    ContactsModule,
    SettingsModule,
    BillingModule,
    AnalyticsModule,
    SearchModule,
    SecurityModule,
    MarketplaceModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
