/**
 * FILE: webhook.service.ts
 * PURPOSE: Processes incoming Meta webhook events and triggers workflow/message handling
 * 
 * DEPENDENCIES:
 * - PrismaService
 * - Workflows engine service (shell)
 * - Analytics/Usage logging (shell)
 * 
 * EXPORTS:
 * - WebhookService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement webhook event parsing, persistence, and dispatch to workflow handlers.
 */

import { BadRequestException, Logger } from '@nestjs/common';

import type { WebhookEventDto as MetaWebhookPayload } from './dto/webhook-event.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowEngineService } from '../workflows/workflow-engine.service';
import { InstagramService } from './instagram.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { AiService } from '../ai/ai.service';

import { Injectable } from '@nestjs/common';


@Injectable()


export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private workflowEngine: WorkflowEngineService,
    private instagramService: InstagramService,
    private messagesGateway: MessagesGateway,
    private aiService: AiService,
  ) {}

  // Main entry point — Meta se aane wale webhook events process karta hai
  async processWebhook(payload: MetaWebhookPayload) {
    this.logger.log(`Webhook received: ${payload?.object}`);

    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Invalid webhook payload');
    }

    if (payload.object !== 'instagram') {
      this.logger.warn(`Unknown webhook object: ${payload.object}`);
      return;
    }

    if (!Array.isArray(payload.entry) || payload.entry.length === 0) {
      this.logger.warn('Webhook payload entry missing/empty');
      return;
    }

    for (const entry of payload.entry) {
      try {
        await this.processEntry(entry);
      } catch (err: any) {
        this.logger.error(`Failed to process webhook entry: ${err?.message ?? err}`);
      }
    }
  }

  private async processEntry(entry: any) {
    const entryId = entry?.id ?? 'unknown';

    // Comment events
    if (Array.isArray(entry?.changes)) {
      for (const change of entry.changes) {
        const field = change?.field;
        const value = change?.value;

        if (field === 'comments') {
          await this.handleCommentEvent(entryId, value);
        }

        if (field === 'mentions') {
          await this.handleMentionEvent(entryId, value);
        }
      }
    }

    // DM events (messaging)
    if (Array.isArray(entry?.messaging)) {
      for (const msg of entry.messaging) {
        await this.handleMessageEvent(entryId, msg);
      }
    }
  }

  // Comment event handle karo
  private async handleCommentEvent(instagramAccountId: string, value: any) {
    try {
      this.logger.log(`Comment event received for account: ${instagramAccountId}`);
      this.logger.log(`Commenter ID: ${value?.from?.id ?? 'unknown'}`);

      const commentText = value?.text ?? '';
      const commentId = value?.comment_id ?? value?.id ?? '';

      const socialAccount = await this.instagramService.findByInstagramAccountId(
        instagramAccountId,
      );

      if (!socialAccount) {
        this.logger.warn(
          `No social account found for Instagram ID: ${instagramAccountId}`,
        );
        return;
      }

      await this.workflowEngine.handleCommentTrigger({
        workspaceId: socialAccount.workspaceId,
        socialAccountId: socialAccount.id,
        accessToken: socialAccount.accessToken,
        commenterId: value?.from?.id,
        commenterUsername: value?.from?.username,
        commentText,
        commentId,
        mediaId: value?.media_id,
      });
    } catch (err: any) {
      this.logger.error(`Error handling comment event: ${err?.message ?? err}`);
    }
  }

  // Mention event handle karo (story mentions etc)
  private async handleMentionEvent(instagramAccountId: string, value: any) {
    this.logger.log(`Mention event received for: ${instagramAccountId}`);
    // Future mein implement hoga — abhi sirf log
  }

  // DM event handle karo — inbox mein save karo + AI auto-reply
  private async handleMessageEvent(instagramAccountId: string, msg: any) {
    try {
      if (!msg?.message?.text) return;

      this.logger.log(`DM received from: ${msg?.sender?.id}`);

      const socialAccount = await this.instagramService.findByInstagramAccountId(
        instagramAccountId,
      );

      if (!socialAccount) {
        this.logger.warn(
          `No social account found for Instagram ID (DM): ${instagramAccountId}`,
        );
        return;
      }

      const senderId = msg.sender?.id;
      if (!senderId) {
        this.logger.warn('DM payload missing sender.id');
        return;
      }

      // Contact dhundho ya banao
      let contact = await this.prisma.contact.findFirst({
        where: {
          workspaceId: socialAccount.workspaceId,
          instagramId: senderId,
        },
      });

      if (!contact) {
        console.log(`[WebhookService] Creating contact for sender=${senderId}`);
        contact = await this.prisma.contact.create({
          data: {
            workspaceId: socialAccount.workspaceId,
            instagramId: senderId,
          },
        });
      }

      // Conversation dhundho ya banao
      let conversation = await this.prisma.conversation.findFirst({
        where: {
          socialAccountId: socialAccount.id,
          contactId: contact.id,
          status: 'open',
        },
      });

      if (!conversation) {
        console.log(
          `[WebhookService] Creating conversation for socialAccountId=${socialAccount.id}, contactId=${contact.id}`,
        );
        conversation = await this.prisma.conversation.create({
          data: {
            workspaceId: socialAccount.workspaceId,
            socialAccountId: socialAccount.id,
            contactId: contact.id,
            platform: 'instagram',
          },
        });
      }

      // Inbound message save karo
      const inboundMessage = await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          direction: 'inbound',
          content: msg.message.text,
          externalId: msg.message.mid,
        },
      });

      this.logger.log(
        `Inbound message saved. conversationId=${conversation.id} externalId=${msg.message.mid}`,
      );

      // Socket se real-time update bhejo (AI badge isAiGenerated flag pe depend karega)
      this.messagesGateway.emitNewMessage(
        socialAccount.workspaceId,
        conversation.id,
        {
          id: inboundMessage.id,
          content: inboundMessage.content,
          direction: 'inbound',
          sentAt: new Date(),
          isAiGenerated: false,
        },
      );


      // ============================================
      // AI AUTO-REPLY LOGIC
      // ============================================
      const aiEnabled = process.env.AI_AUTO_REPLY_ENABLED === 'true';
      if (!aiEnabled) return;

      this.logger.log('AI auto-reply enabled — processing...');

      const messageText = msg.message.text;

      // Intent detect karo
      const intentResult = await this.aiService.detectIntent(messageText);
      this.logger.log(
        `Intent: ${intentResult.intent} (${intentResult.confidence})`,
      );

      // Spam ko skip karo
      if (intentResult.isSpam) {
        this.logger.log('Spam detected — skipping AI reply');
        return;
      }

      // Recent conversation history fetch karo
      const recentMessages = await this.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { sentAt: 'desc' },
        take: 10,
      });

      const conversationHistory = recentMessages
        .reverse()
        .slice(0, -1)
        .map((m: any) => ({
          role: (m.direction === 'inbound' ? 'user' : 'assistant') as
            | 'user'
            | 'assistant',
          content: m.content,
        }));

      // Business context
      const businessContext = `
Business Name: AutoFlow Customer
Platform: Instagram
Language: Hindi/English mix preferred
      `;

      // AI reply generate
      const aiResult = await this.aiService.generateReply(
        messageText,
        intentResult.intent,
        businessContext,
        conversationHistory,
      );

      if (!aiResult.reply) {
        this.logger.log('No AI reply generated');
        return;
      }

      // DM bhejo
      const dmSent = await this.instagramService.sendDM(
        socialAccount.accessToken,
        senderId,
        aiResult.reply,
      );

      if (!dmSent) {
        this.logger.warn('AI DM send failed');
        return;
      }

      // Outbound AI message save
      const aiMessage = await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          direction: 'outbound',
          content: aiResult.reply,
          isAiGenerated: true,
        },
      });

      // Inbox update
      this.messagesGateway.emitNewMessage(socialAccount.workspaceId, conversation.id, {
        id: aiMessage.id,
        content: aiMessage.content,
        direction: 'outbound',
        sentAt: new Date(),
        isAiGenerated: true,
      });


      // Lead score update (sales)
      if (intentResult.intent === 'sales') {
        await this.prisma.contact.update({
          where: { id: contact.id },
          data: { leadScore: { increment: 10 } },
        });
      }

      this.logger.log(
        `AI reply sent successfully: "${aiResult.reply.slice(0, 50)}..."`,
      );
    } catch (err: any) {
      this.logger.error(`Error handling message event: ${err?.message ?? err}`);
    }
  }
}


