/**
 * FILE: workflows.module.ts
 * PURPOSE: Registers workflows controllers/services/engine providers
 */

import { Module, forwardRef } from '@nestjs/common'; // 👈 forwardRef add kiya

import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowEngineService } from './workflow-engine.service';
import { InstagramModule } from '../instagram/instagram.module';
import { AIModule } from '../ai/ai.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    forwardRef(() => InstagramModule), // 👈 Circular dependency fix ki
    AIModule, 
    PrismaModule,
    BillingModule
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowEngineService],
  exports: [WorkflowEngineService],
})
export class WorkflowsModule {}