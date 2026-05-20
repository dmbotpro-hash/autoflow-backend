import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private prisma: PrismaService) {}

  async canProcessMessage(workspaceId: string): Promise<boolean> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        plan: true,
        subscriptionStatus: true,
        monthlyMessageCount: true,
      },
    });

    if (!workspace) {
      this.logger.warn(`Workspace not found for id: ${workspaceId}`);
      return false;
    }

    if (workspace.subscriptionStatus === 'EXPIRED' || workspace.subscriptionStatus === 'CANCELED') {
      this.logger.log(`Workspace ${workspaceId} subscription status is ${workspace.subscriptionStatus}. Access denied.`);
      return false;
    }

    if (workspace.plan === 'FREE' && workspace.monthlyMessageCount >= 50) {
      this.logger.log(`Workspace ${workspaceId} plan is FREE and monthly message limit has been reached (${workspace.monthlyMessageCount}/50). Access denied.`);
      return false;
    }

    return true;
  }

  async incrementMessageCount(workspaceId: string): Promise<void> {
    try {
      await this.prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          monthlyMessageCount: {
            increment: 1,
          },
        },
      });
      this.logger.log(`Incremented monthlyMessageCount for workspaceId: ${workspaceId}`);
    } catch (err: any) {
      this.logger.error(`Failed to increment monthly message count for workspace ${workspaceId}: ${err?.message ?? err}`);
    }
  }
}
