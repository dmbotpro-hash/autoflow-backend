/**
 * FILE: workflow-engine.service.ts
 * PURPOSE: Executes workflow graphs when Instagram webhook triggers occur
 * 
 * DEPENDENCIES:
 * - WorkflowsService
 * - AI service (shell)
 * - Messages service (shell)
 * 
 * EXPORTS:
 * - WorkflowEngineService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement workflow evaluation/execution strategy (trigger->nodes) in later session.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InstagramService } from '../instagram/instagram.service';
import { SubscriptionService } from '../billing/subscription.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { AnalyticsService } from '../analytics/analytics.service';

interface CommentTriggerPayload {
  workspaceId: string;
  socialAccountId: string;
  accessToken: string;
  commenterId: string;
  commenterUsername?: string;
  commentText: string;
  commentId: string;
  mediaId?: string;
}

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(
    private prisma: PrismaService,
    private instagramService: InstagramService,
    private subscriptionService: SubscriptionService,
    private messagesGateway: MessagesGateway,
    private analyticsService: AnalyticsService,
  ) {}

  async handleCommentTrigger(payload: CommentTriggerPayload) {
    this.logger.log(
      `[WorkflowEngineService] handleCommentTrigger workspaceId=${payload.workspaceId} socialAccountId=${payload.socialAccountId}`,
    );
    this.logger.log(`[WorkflowEngineService] commentText="${payload.commentText}"`);

    if (!payload?.workspaceId) {
      this.logger.warn('[WorkflowEngineService] Missing workspaceId in payload');
      return;
    }

    const canProcess = await this.subscriptionService.canProcessMessage(payload.workspaceId);
    if (!canProcess) {
      this.logger.warn(`[Subscription] Limit reached or expired for workspaceId ${payload.workspaceId}`);
      return;
    }

    const spam = await this.isSpam(payload.workspaceId, payload.commenterId);
    if (spam) {
      this.logger.warn(`[Anti-Spam] Cooldown active for commenterId ${payload.commenterId}`);
      return;
    }

    const workflows = await this.prisma.workflow.findMany({
      where: {
        workspaceId: payload.workspaceId,
        trigger: 'comment_keyword',
        isActive: true,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!workflows.length) {
      this.logger.log('[WorkflowEngineService] No active workflows found');
      return;
    }

    this.logger.log(`[WorkflowEngineService] Found ${workflows.length} active workflow(s)`);

    for (const workflow of workflows) {
      try {
        await this.executeCommentWorkflow(workflow, payload);
      } catch (err: any) {
        this.logger.error(
          `[WorkflowEngineService] executeCommentWorkflow failed workflowId=${workflow.id} error=${err?.message ?? err}`,
        );
      }
    }
  }

  private async executeCommentWorkflow(workflow: any, payload: CommentTriggerPayload) {
    const config = workflow.config as {
      keywords: string[];
      dmMessage: string;
      publicReply?: string;
      delaySeconds?: number;
      replyOnce?: boolean;
    };

    if (!config?.keywords?.length) {
      this.logger.warn(`[WorkflowEngineService] Workflow ${workflow.id} missing config.keywords`);
      return;
    }

    const commentLower = (payload.commentText || '').toLowerCase();

    const keywordMatched = config.keywords.some((k) =>
      commentLower.includes(String(k).toLowerCase()),
    );

    if (!keywordMatched) {
      this.logger.log(`[WorkflowEngineService] No keyword match for workflow=${workflow.name}`);
      return;
    }

    this.logger.log(`[WorkflowEngineService] Keyword match. workflow=${workflow.name}`);

    if (config.replyOnce) {
      const alreadyReplied = await this.checkAlreadyReplied(payload.workspaceId, payload.commenterId);
      if (alreadyReplied) {
        this.logger.log(`[WorkflowEngineService] replyOnce hit. Skipping commenterId=${payload.commenterId}`);
        return;
      }
    }

    if (config.delaySeconds && config.delaySeconds > 0) {
      this.logger.log(`[WorkflowEngineService] Delay ${config.delaySeconds}s before DM`);
      await this.delay(config.delaySeconds * 1000);
    }

    let dmSent = false;
    try {
      dmSent = await this.instagramService.sendDM(
        payload.accessToken,
        payload.commenterId,
        config.dmMessage,
      );
    } catch (err: any) {
      this.logger.error(
        `[WorkflowEngineService] Final delivery failed after 3 retries for commenterId=${payload.commenterId}: ${err?.message ?? err}`,
      );
    }

    if (!dmSent) {
      this.logger.warn(`[WorkflowEngineService] DM send failed commenterId=${payload.commenterId}`);
      return;
    }

    // Save outbound message + usage log
    await this.saveOutboundMessage(payload, config.dmMessage, config.publicReply);
    await this.logUsage(payload.workspaceId, 'message_sent', {
      workflowId: workflow.id,
      workflowName: workflow.name,
      commenterId: payload.commenterId,
    });

    await this.subscriptionService.incrementMessageCount(payload.workspaceId);

    if (config.publicReply && config.publicReply.trim()) {
      try {
        await this.instagramService.replyToComment(
          payload.accessToken,
          payload.commentId,
          config.publicReply.trim(),
        );
        this.logger.log(`[WorkflowEngineService] Public reply posted commentId=${payload.commentId}`);
      } catch (err: any) {
        this.logger.error(
          `[WorkflowEngineService] Public reply final delivery failed: ${err?.message ?? err}`,
        );
      }
    }
  }

  private async checkAlreadyReplied(workspaceId: string, commenterId: string): Promise<boolean> {
    try {
      const log = await this.prisma.usageLog.findFirst({
        where: {
          workspaceId,
          type: 'message_sent',
          metadata: {
            path: ['commenterId'],
            equals: commenterId,
          },
        },
      });

      // NOTE: workspaceId condition intentionally not enforced here due to schema limitations.
      return !!log;
    } catch {
      // Fail-open: if usageLog query fails, don't block DM.
      return false;
    }
  }

  private async saveOutboundMessage(
    payload: CommentTriggerPayload,
    content: string,
    _publicReply?: string,
  ) {
    try {
      let contact = await this.prisma.contact.findFirst({
        where: {
          workspaceId: payload.workspaceId,
          instagramId: payload.commenterId,
        },
      });

      if (!contact) {
        console.log(`[WorkflowEngineService] Creating contact commenterId=${payload.commenterId}`);
        contact = await this.prisma.contact.create({
          data: {
            workspaceId: payload.workspaceId,
            instagramId: payload.commenterId,
            username: payload.commenterUsername,
          },
        });
      }

      let conversation = await this.prisma.conversation.findFirst({
        where: {
          socialAccountId: payload.socialAccountId,
          contactId: contact.id,
        },
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            workspaceId: payload.workspaceId,
            socialAccountId: payload.socialAccountId,
            contactId: contact.id,
            platform: 'instagram',
          },
        });
      }

      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          direction: 'outbound',
          content,
          isAiGenerated: false,
        },
      });

      this.logger.log(`[WorkflowEngineService] Outbound message saved conversationId=${conversation.id}`);
    } catch (err: any) {
      this.logger.error(`[WorkflowEngineService] saveOutboundMessage failed: ${err?.message ?? err}`);
    }
  }

  private async logUsage(workspaceId: string, type: string, metadata?: any) {
    try {
      const log = await this.prisma.usageLog.create({
        data: { workspaceId, type, count: 1, metadata },
      });
      const event = this.analyticsService.formatUsageLogEvent(log);
      this.messagesGateway.emitActivityEvent(workspaceId, event);
    } catch (err: any) {
      this.logger.error(`[WorkflowEngineService] logUsage failed: ${err?.message ?? err}`);
    }
  }

  async isSpam(workspaceId: string, commenterId: string): Promise<boolean> {
    try {
      const sixtySecondsAgo = new Date(Date.now() - 60000);
      const log = await this.prisma.usageLog.findFirst({
        where: {
          workspaceId,
          type: 'message_sent',
          createdAt: {
            gte: sixtySecondsAgo,
          },
          metadata: {
            path: ['commenterId'],
            equals: commenterId,
          },
        },
      });
      return !!log;
    } catch (err: any) {
      this.logger.error(`[Anti-Spam] isSpam check failed: ${err?.message ?? err}`);
      return false; // Fail-open
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
