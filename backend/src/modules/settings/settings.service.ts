import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type UpdateSettingsPayload = {
  aiTone: string;
  aiPrompt: string;
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(workspaceId: string) {
    const [workspace, socialAccount, workflowCount] = await Promise.all([
      this.prisma.workspace.findUnique({ where: { id: workspaceId } }),
      this.prisma.socialAccount.findFirst({
        where: { workspaceId, platform: 'instagram', isActive: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.workflow.count({
        where: { workspaceId, deletedAt: null },
      }),
    ]);

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    return {
      aiTone: workspace.aiTone,
      aiPrompt: workspace.aiPrompt,
      instaConnected: Boolean(socialAccount?.isActive),
      instaUsername: socialAccount?.accountName ?? null,
      onboardingCompletedAt: workspace.onboardingCompletedAt,
      onboardingComplete:
        Boolean(workspace.onboardingCompletedAt) ||
        (Boolean(socialAccount?.isActive) && workflowCount > 0),
    };
  }

  async completeOnboarding(workspaceId: string) {
    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: { onboardingCompletedAt: new Date() },
      select: { onboardingCompletedAt: true },
    });
  }

  async updateSettings(workspaceId: string, dto: UpdateSettingsPayload) {
    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        aiTone: dto.aiTone,
        aiPrompt: dto.aiPrompt,
      },
    });
  }

  async connectInstagram(
    workspaceId: string,
    dto?: { accountName?: string; accountId?: string; accessToken?: string },
  ) {
    const accountName = dto?.accountName ?? 'mock_business';
    const accountId = dto?.accountId ?? `mock_${workspaceId.slice(0, 8)}`;

    // Mock connect: ensure only one active instagram social account per workspace.
    await this.prisma.socialAccount.updateMany({
      where: {
        workspaceId,
        platform: 'instagram',
        isActive: true,
      },
      data: { isActive: false },
    });

    const social = await this.prisma.socialAccount.create({
      data: {
        workspaceId,
        platform: 'instagram',
        accountId,
        accountName,
        accessToken: dto?.accessToken ?? 'mock-access-token',
        isActive: true,
      },
    });

    return {
      instaConnected: true,
      instaUsername: social.accountName,
      username: social.accountName,
    };
  }

  async disconnectInstagram(workspaceId: string) {
    const active = await this.prisma.socialAccount.findFirst({
      where: { workspaceId, platform: 'instagram', isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!active) {
      return { disconnected: true };
    }

    await this.prisma.socialAccount.update({
      where: { id: active.id },
      data: { isActive: false },
    });

    return { disconnected: true };
  }
}

