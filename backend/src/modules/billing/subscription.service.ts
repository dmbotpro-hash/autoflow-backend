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

  private getPlanLimit(plan: string): number {
    switch (plan) {
      case 'PRO':
        return 5000;
      case 'AGENCY':
        return 100000;
      default:
        return 50;
    }
  }

  async getWorkspaceUsage(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        plan: true,
        subscriptionStatus: true,
        monthlyMessageCount: true,
      },
    });

    if (!workspace) {
      return {
        plan: 'FREE',
        subscriptionStatus: 'TRIAL',
        monthlyMessageCount: 0,
        monthlyLimit: 50,
        usagePercentage: 0,
      };
    }

    const monthlyLimit = this.getPlanLimit(workspace.plan);
    const monthlyMessageCount = workspace.monthlyMessageCount;
    const usagePercentage =
      monthlyLimit > 0
        ? Math.min(100, Math.round((monthlyMessageCount / monthlyLimit) * 100))
        : 0;

    return {
      plan: workspace.plan,
      subscriptionStatus: workspace.subscriptionStatus,
      monthlyMessageCount,
      monthlyLimit,
      usagePercentage,
    };
  }

  async upgradePlan(workspaceId: string, plan: 'FREE' | 'PRO' | 'AGENCY') {
    const workspace = await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        plan,
        subscriptionStatus: plan === 'FREE' ? 'TRIAL' : 'ACTIVE',
        subscriptionExpiresAt:
          plan === 'FREE'
            ? null
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      select: {
        id: true,
        plan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });

    await this.prisma.subscription.create({
      data: {
        workspaceId,
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: workspace.subscriptionExpiresAt,
      },
    });

    this.logger.log(`Workspace ${workspaceId} upgraded to ${plan}`);
    return workspace;
  }

  createCheckoutSession(workspaceId: string, plan: 'PRO' | 'AGENCY') {
    const mockSessionId = `cs_mock_${workspaceId.slice(0, 8)}_${Date.now()}`;
    return {
      sessionId: mockSessionId,
      checkoutUrl: `/billing?upgraded=${plan}&session=${mockSessionId}`,
      plan,
      message:
        'Mock Stripe checkout — call POST /billing/upgrade after redirect to apply plan.',
    };
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
