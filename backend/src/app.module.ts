/**
 * FILE: app.module.ts
 * PURPOSE: Root NestJS module that wires together all AutoFlow backend modules
 * 
 * DEPENDENCIES:
 * - Module decorator (NestJS)
 * - AppConfig (app.config)
 * - DatabaseConfig (database.config)
 * - JwtConfig (jwt.config)
 * - Feature modules: Auth, Users, Workspaces, Instagram, Workflows, Messages, Contacts, AI, Analytics, Billing
 * 
 * EXPORTS:
 * - AppModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Add module imports for all feature modules and initialize configuration modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma.service';

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

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    BillingModule,
    AnalyticsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}





