import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';
import { AiService } from './ai.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * POST /ai/summary
   * Body: { conversationId: string }
   * Returns: { summary: string }
   */
  @Post('summary')
  async getSummary(
    @WorkspaceId() workspaceId: string,
    @Body() body: { conversationId: string },
  ) {
    if (!body.conversationId) {
      throw new BadRequestException('conversationId is required');
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: { id: body.conversationId, workspaceId },
    });
    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId: body.conversationId },
      orderBy: { sentAt: 'asc' },
      select: { direction: true, content: true },
    });

    const summary = await this.aiService.summarizeConversation(messages);
    return { summary };
  }

  /**
   * POST /ai/smart-replies
   * Body: { conversationId: string }
   * Returns: { replies: string[] }
   */
  @Post('smart-replies')
  async getSmartReplies(
    @WorkspaceId() workspaceId: string,
    @Body() body: { conversationId: string },
  ) {
    if (!body.conversationId) {
      throw new BadRequestException('conversationId is required');
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: { id: body.conversationId, workspaceId },
    });
    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId: body.conversationId },
      orderBy: { sentAt: 'desc' },
      take: 10,
      select: { direction: true, content: true },
    });

    const lastInbound = messages.find((m) => m.direction === 'inbound');
    if (!lastInbound) {
      return { replies: ['How can I help?', 'Thanks for reaching out!', 'Let me look into that.'] };
    }

    const context = messages
      .reverse()
      .map((m) => `${m.direction === 'inbound' ? 'Customer' : 'Agent'}: ${m.content}`)
      .join('\n');

    const replies = await this.aiService.getSmartReplies(lastInbound.content, context);
    return { replies };
  }

  /**
   * POST /ai/generate-workflow
   * Body: { prompt: string }
   * Returns: { workflow: WorkflowDraft, explanation: string }
   */
  @Post('generate-workflow')
  async generateWorkflow(
    @WorkspaceId() _workspaceId: string,
    @Body() body: { prompt: string },
  ) {
    if (!body.prompt) {
      throw new BadRequestException('prompt is required');
    }
    return this.aiService.generateWorkflow(body.prompt);
  }

  /**
   * POST /ai/recommendations
   * Returns: { recommendations: string[] }
   */
  @Post('recommendations')
  async getRecommendations(@WorkspaceId() workspaceId: string) {
    // Count active workflows for context
    const workflowCount = await this.prisma.workflow.count({
      where: { workspaceId, isActive: true },
    });

    const recs: string[] = [
      workflowCount === 0
        ? '⚡ You have no active workflows yet. Ask AI to create your first one!'
        : `⚡ You have ${workflowCount} active workflow(s). Consider adding a fallback branch.`,
      '💡 Add a delay node (1–2 hours) after your trigger to feel more human.',
      '🎯 Use keyword triggers like "price", "info", or "details" for high-intent leads.',
      '📊 Connect a CRM node to tag leads automatically when they reply.',
    ];

    return { recommendations: recs };
  }
}
