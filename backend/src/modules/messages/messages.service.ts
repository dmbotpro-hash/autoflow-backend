import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InstagramService } from '../instagram/instagram.service';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private instagramService: InstagramService,
    private messagesGateway: MessagesGateway,
  ) {}

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
            leadScore: true,
            tags: true,
            notes: true,
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

  async saveOutboundMessage(
    workspaceId: string,
    conversationId: string,
    content: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
      include: {
        contact: true,
        socialAccount: true,
      },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const recipientId = conversation.contact?.instagramId;
    const accessToken = conversation.socialAccount?.accessToken;

    let dmSent = false;
    if (recipientId && accessToken) {
      dmSent = await this.instagramService.sendDM(
        accessToken,
        recipientId,
        content,
      );
      if (!dmSent) {
        throw new BadRequestException(
          'Failed to send message to Instagram. Check account connection and tokens.',
        );
      }
    }

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

    this.messagesGateway.emitNewMessage(workspaceId, conversationId, {
      id: message.id,
      content: message.content,
      direction: message.direction,
      sentAt: message.sentAt,
      isAiGenerated: message.isAiGenerated,
    });

    return { message, dmSent };
  }

  async updateStatus(
    workspaceId: string,
    conversationId: string,
    status: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });

    this.messagesGateway.emitConversationUpdate(workspaceId, updated);

    return updated;
  }

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
