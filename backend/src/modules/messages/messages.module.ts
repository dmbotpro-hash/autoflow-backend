/**
 * FILE: messages.module.ts
 * PURPOSE: Registers messages controller/service and websocket gateway
 * 
 * DEPENDENCIES:
 * - NestJS Module decorator
 * - MessagesController, MessagesService, MessagesGateway
 * 
 * EXPORTS:
 * - MessagesModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Wire websocket gateway and message services for real-time inbox updates.
 */

import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}



