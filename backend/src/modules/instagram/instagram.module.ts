/**
 * FILE: instagram.module.ts
 * PURPOSE: Registers Instagram integration providers (controller/service/webhook)
 */

import { Module, forwardRef } from '@nestjs/common'; // 👈 forwardRef add kiya
import { HttpModule } from '@nestjs/axios';

import { InstagramService } from './instagram.service';
import { InstagramController } from './instagram.controller';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { MessagesModule } from '../messages/messages.module';
import { AIModule } from '../ai/ai.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkflowsModule } from '../workflows/workflows.module';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [
    HttpModule, 
    MessagesModule, 
    AIModule, 
    PrismaModule,
    forwardRef(() => WorkflowsModule) // 👈 Circular dependency fix ki
  ],
  controllers: [InstagramController, WebhookController],
  providers: [InstagramService, WebhookService, PrismaService],
  exports: [InstagramService],
})
export class InstagramModule {}