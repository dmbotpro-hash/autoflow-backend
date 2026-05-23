/**
 * FILE: billing.module.ts
 * PURPOSE: Registers billing controller/service providers for subscription management
 * 
 * DEPENDENCIES:
 * - NestJS Module decorator
 * - BillingController, BillingService
 * 
 * EXPORTS:
 * - BillingModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Wire BillingService for plan/subscription state management.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, RolesGuard],
  exports: [SubscriptionService],
})
export class BillingModule {}

