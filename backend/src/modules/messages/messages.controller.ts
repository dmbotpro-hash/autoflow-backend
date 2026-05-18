/**
 * FILE: messages.controller.ts
 * PURPOSE: Exposes HTTP endpoints for fetching inbox conversations and message history
 * 
 * DEPENDENCIES:
 * - NestJS Controller decorators
 * - MessagesService
 * 
 * EXPORTS:
 * - MessagesController class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define endpoints to list conversations and retrieve message threads.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) { }

  @Get('conversations')
  async getConversations(@WorkspaceId() workspaceId: string) {
    return this.messagesService.getConversations(workspaceId);
  }

  @Get('conversations/:id')
  getMessages(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    return this.messagesService.getMessages(workspaceId, id);
  }

  @Post('conversations/:id/send')
  sendMessage(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.messagesService.saveOutboundMessage(
      workspaceId,
      id,
      body.content,
    );
  }

  @Patch('conversations/:id/status')
  updateStatus(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.messagesService.updateStatus(workspaceId, id, body.status);
  }

  @Get('stats')
  getStats(@WorkspaceId() workspaceId: string) {
    return this.messagesService.getDashboardStats(workspaceId);
  }
}


