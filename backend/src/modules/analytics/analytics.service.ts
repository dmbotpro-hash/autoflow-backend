import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface WorkspaceDashboardStats {
  totalAutomations: number;
  faqIntercepts: number;
  aiReplies: number;
  hoursSaved: number;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getWorkspaceDashboardStats(workspaceId: string): Promise<WorkspaceDashboardStats> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      this.logger.warn(`Workspace not found: ${workspaceId}`);
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const logs = await this.prisma.usageLog.findMany({
      where: {
        workspaceId,
        createdAt: {
          gte: startOfMonth,
        },
        type: {
          in: ['message_sent', 'faq_intercept', 'ai_reply'],
        },
      },
    });

    let faqIntercepts = 0;
    let aiReplies = 0;
    let workflowReplies = 0;

    for (const log of logs) {
      if (log.type === 'faq_intercept') {
        faqIntercepts += log.count;
      } else if (log.type === 'ai_reply') {
        aiReplies += log.count;
      } else if (log.type === 'message_sent') {
        workflowReplies += log.count;
      }
    }

    const totalAutomations = faqIntercepts + aiReplies + workflowReplies;
    const hoursSaved = parseFloat(((totalAutomations * 2) / 60).toFixed(1));

    return {
      totalAutomations,
      faqIntercepts,
      aiReplies,
      hoursSaved,
    };
  }
}
