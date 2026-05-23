import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: { organization: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      plan: m.workspace.plan,
      role: m.role,
      organization: m.workspace.organization
        ? {
            id: m.workspace.organization.id,
            name: m.workspace.organization.name,
          }
        : null,
    }));
  }

  async createForUser(
    userId: string,
    data: { name: string; organizationId?: string },
  ) {
    const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    let organizationId = data.organizationId;
    if (!organizationId) {
      const existing = await this.prisma.workspaceMember.findFirst({
        where: { userId },
        include: { workspace: true },
      });
      organizationId = existing?.workspace.organizationId ?? undefined;

      if (!organizationId) {
        const org = await this.prisma.organization.create({
          data: {
            name: `${data.name} Agency`,
            slug: `org-${Date.now()}`,
          },
        });
        organizationId = org.id;
      }
    }

    const workspace = await this.prisma.workspace.create({
      data: {
        name: data.name,
        slug,
        organizationId,
        members: {
          create: { userId, role: 'owner' },
        },
      },
      include: { organization: true },
    });

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      plan: workspace.plan,
      role: 'owner',
      organization: workspace.organization
        ? { id: workspace.organization.id, name: workspace.organization.name }
        : null,
    };
  }

  async getOrganizationForUser(userId: string) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { userId },
      include: {
        workspace: { include: { organization: true } },
      },
    });
    if (!member?.workspace.organization) return null;
    const org = member.workspace.organization;
    const count = await this.prisma.workspace.count({
      where: { organizationId: org.id },
    });
    return { id: org.id, name: org.name, slug: org.slug, workspaceCount: count };
  }

  async assertMember(userId: string, workspaceId: string, roles?: string[]) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!member) throw new ForbiddenException('Not a workspace member');
    if (roles && !roles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return member;
  }

  async listMembers(workspaceId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, email: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      email: m.user.email,
      name: m.user.name,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      joinedAt: m.createdAt,
    }));
  }

  async createInvite(
    workspaceId: string,
    invitedById: string,
    email: string,
    role: string,
  ) {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@')) {
      throw new BadRequestException('Invalid email');
    }
    if (!['admin', 'member'].includes(role)) {
      throw new BadRequestException('Role must be admin or member');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await this.prisma.workspaceInvite.upsert({
      where: {
        workspaceId_email: { workspaceId, email: normalized },
      },
      create: {
        workspaceId,
        email: normalized,
        role,
        invitedById,
        expiresAt,
        status: 'pending',
      },
      update: {
        role,
        invitedById,
        expiresAt,
        status: 'pending',
      },
    });

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      status: invite.status,
      token: invite.token,
      expiresAt: invite.expiresAt,
      inviteLink: `/team/accept?token=${invite.token}`,
    };
  }

  async listInvites(workspaceId: string) {
    return this.prisma.workspaceInvite.findMany({
      where: { workspaceId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });
  }

  async revokeInvite(workspaceId: string, inviteId: string) {
    const invite = await this.prisma.workspaceInvite.findFirst({
      where: { id: inviteId, workspaceId },
    });
    if (!invite) throw new NotFoundException('Invite not found');
    await this.prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: { status: 'revoked' },
    });
    return { success: true };
  }

  async acceptInvite(token: string, userId: string, userEmail: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({
      where: { token },
    });
    if (!invite || invite.status !== 'pending') {
      throw new BadRequestException('Invalid or expired invite');
    }
    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite expired');
    }
    if (invite.email !== userEmail.toLowerCase()) {
      throw new ForbiddenException('Invite email does not match your account');
    }

    await this.prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: { userId, workspaceId: invite.workspaceId },
      },
      create: {
        userId,
        workspaceId: invite.workspaceId,
        role: invite.role,
      },
      update: { role: invite.role },
    });

    await this.prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: 'accepted' },
    });

    return { workspaceId: invite.workspaceId };
  }

  async removeMember(workspaceId: string, targetUserId: string, actorUserId: string) {
    if (targetUserId === actorUserId) {
      throw new BadRequestException('Cannot remove yourself');
    }
    const target = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    });
    if (!target) throw new NotFoundException('Member not found');
    if (target.role === 'owner') {
      throw new ForbiddenException('Cannot remove workspace owner');
    }
    await this.prisma.workspaceMember.delete({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    });
    return { success: true };
  }
}
