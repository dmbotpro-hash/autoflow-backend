/**
 * FILE: messages.service.ts
 * PURPOSE: Implements business logic for conversation and message persistence/sending
 * 
 * DEPENDENCIES:
 * - PrismaService (Conversation, Message)
 * - Instagram API client (shell)
 * 
 * EXPORTS:
 * - MessagesService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement methods to get conversations, get messages, and send outbound messages.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Workspace ki saari conversations (last message preview)
  async getConversations(workspaceId: string) {
    return this.prisma.conversation.findMany({
      where: { workspaceId },
      include: {
        contact: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            instagramId: true,
          },
        },
        socialAccount: true,
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Ek conversation ke saare messages
  async getMessages(workspaceId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
      include: {
        contact: true,
        socialAccount: {
          select: {
            id: true,
            accountName: true,
            accountId: true,
          },
        },
      },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    });

    return { conversation, messages };
  }

  // Manual/outbound message save (UI send ke baad)
  async saveOutboundMessage(
    workspaceId: string,
    conversationId: string,
    content: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        direction: 'outbound',
        content,
        isAiGenerated: false,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  // Conversation status update (open/closed)
  async updateStatus(
    workspaceId: string,
    conversationId: string,
    status: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }

  // Dashboard stats ke liye counts
  async getDashboardStats(workspaceId: string) {
    const [totalMessages, totalContacts, activeConversations, automationCount] =
      await Promise.all([
        this.prisma.message.count({
          where: { conversation: { workspaceId }, direction: 'outbound' },
        }),
        this.prisma.contact.count({
          where: { workspaceId, deletedAt: null },
        }),
        this.prisma.conversation.count({
          where: { workspaceId, status: 'open' },
        }),
        this.prisma.workflow.count({
          where: { workspaceId, isActive: true, deletedAt: null },
        }),
      ]);

    return {
      totalMessages,
      totalContacts,
      activeConversations,
      automationCount,
    };
  }
}


