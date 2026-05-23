import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ActivityEventDto,
  ActivityEventType,
  ActivitySeverity,
  AnalyticsOverview,
} from './analytics.types';

export interface WorkspaceDashboardStats {
  totalAutomations: number;
  faqIntercepts: number;
  aiReplies: number;
  hoursSaved: number;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getWorkspaceDashboardStats(
    workspaceId: string,
  ): Promise<WorkspaceDashboardStats> {
    const overview = await this.getOverview(workspaceId);
    return {
      totalAutomations: overview.metrics.totalAutomations,
      faqIntercepts: overview.metrics.faqIntercepts,
      aiReplies: overview.metrics.aiReplies,
      hoursSaved: overview.metrics.hoursSaved,
    };
  }

  async getOverview(workspaceId: string): Promise<AnalyticsOverview> {
    await this.ensureWorkspace(workspaceId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalMessages,
      outboundMessages,
      totalContacts,
      hotLeads,
      activeConversations,
      activeWorkflows,
      workflows,
      usageLogs,
      inboundWeek,
      outboundWeek,
      contactsWeek,
    ] = await Promise.all([
      this.prisma.message.count({
        where: { conversation: { workspaceId } },
      }),
      this.prisma.message.count({
        where: { conversation: { workspaceId }, direction: 'outbound' },
      }),
      this.prisma.contact.count({
        where: { workspaceId, deletedAt: null },
      }),
      this.prisma.contact.count({
        where: { workspaceId, deletedAt: null, leadScore: { gte: 50 } },
      }),
      this.prisma.conversation.count({
        where: { workspaceId, status: 'open' },
      }),
      this.prisma.workflow.count({
        where: { workspaceId, isActive: true, deletedAt: null },
      }),
      this.prisma.workflow.findMany({
        where: { workspaceId, deletedAt: null },
        select: { id: true, name: true, isActive: true, trigger: true },
      }),
      this.prisma.usageLog.findMany({
        where: { workspaceId, createdAt: { gte: startOfMonth } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.findMany({
        where: {
          conversation: { workspaceId },
          direction: 'inbound',
          sentAt: { gte: sevenDaysAgo },
        },
        select: { sentAt: true },
      }),
      this.prisma.message.findMany({
        where: {
          conversation: { workspaceId },
          direction: 'outbound',
          sentAt: { gte: sevenDaysAgo },
        },
        select: { sentAt: true, isAiGenerated: true },
      }),
      this.prisma.contact.findMany({
        where: { workspaceId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    let faqIntercepts = 0;
    let aiReplies = 0;
    let workflowExecutions = 0;
    const workflowExecMap = new Map<string, number>();
    const heatmap = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));

    for (const log of usageLogs) {
      const hour = log.createdAt.getHours();
      heatmap[hour].count += log.count;

      if (log.type === 'faq_intercept') faqIntercepts += log.count;
      else if (log.type === 'ai_reply') aiReplies += log.count;
      else if (log.type === 'message_sent') {
        workflowExecutions += log.count;
        const wfId = (log.metadata as { workflowId?: string })?.workflowId;
        if (wfId) {
          workflowExecMap.set(wfId, (workflowExecMap.get(wfId) ?? 0) + log.count);
        }
      }
    }

    const totalAutomations = faqIntercepts + aiReplies + workflowExecutions;
    const hoursSaved = parseFloat(((totalAutomations * 2) / 60).toFixed(1));
    const deliveryRate =
      totalMessages > 0
        ? Math.min(100, Math.round((outboundMessages / totalMessages) * 100))
        : 0;

    const chart = this.buildChartData(sevenDaysAgo, inboundWeek, outboundWeek, usageLogs);
    const funnel = this.buildFunnel(
      inboundWeek.length,
      outboundMessages,
      totalContacts,
      hotLeads,
    );

    return {
      metrics: {
        totalMessages,
        totalContacts,
        activeConversations,
        activeWorkflows,
        totalAutomations,
        aiReplies,
        faqIntercepts,
        hoursSaved,
        deliveryRate,
      },
      chart,
      funnel,
      workflows: workflows.map((w) => ({
        id: w.id,
        name: w.name,
        isActive: w.isActive,
        trigger: w.trigger,
        executions: workflowExecMap.get(w.id) ?? 0,
      })),
      heatmap,
    };
  }

  async getEvents(workspaceId: string, limit = 40): Promise<ActivityEventDto[]> {
    await this.ensureWorkspace(workspaceId);

    const [logs, recentContacts, recentInbound] = await Promise.all([
      this.prisma.usageLog.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.prisma.contact.findMany({
        where: { workspaceId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          username: true,
          leadScore: true,
          createdAt: true,
        },
      }),
      this.prisma.message.findMany({
        where: {
          conversation: { workspaceId },
          direction: 'inbound',
        },
        orderBy: { sentAt: 'desc' },
        take: 10,
        select: {
          id: true,
          content: true,
          sentAt: true,
          conversation: {
            select: { contact: { select: { username: true, name: true } } },
          },
        },
      }),
    ]);

    const fromLogs = logs.map((log) => this.formatUsageLogEvent(log));
    const fromContacts: ActivityEventDto[] = recentContacts.map((c) => ({
      id: `contact-${c.id}`,
      type: 'lead_captured' as ActivityEventType,
      title: 'Lead captured',
      description: c.username
        ? `@${c.username} added to CRM`
        : c.name ?? 'New contact',
      severity: c.leadScore >= 50 ? 'success' : 'info',
      createdAt: c.createdAt.toISOString(),
      metadata: { contactId: c.id, leadScore: c.leadScore },
    }));
    const fromInbound: ActivityEventDto[] = recentInbound.map((m) => ({
      id: `msg-${m.id}`,
      type: 'inbound_dm' as ActivityEventType,
      title: 'Inbound DM',
      description: this.truncate(
        `${m.conversation?.contact?.username ? `@${m.conversation.contact.username}: ` : ''}${m.content}`,
        80,
      ),
      severity: 'info',
      createdAt: m.sentAt.toISOString(),
    }));

    return [...fromLogs, ...fromContacts, ...fromInbound]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }

  formatUsageLogEvent(log: {
    id: string;
    type: string;
    count: number;
    createdAt: Date;
    metadata?: unknown;
  }): ActivityEventDto {
    const meta = (log.metadata ?? {}) as Record<string, unknown>;
    let type: ActivityEventType = 'dm_sent';
    let title = 'DM sent';
    let description = 'Automation message delivered';
    let severity: ActivitySeverity = 'success';

    switch (log.type) {
      case 'ai_reply':
        type = 'ai_replied';
        title = 'AI replied';
        description = 'AutoFlow AI sent a smart reply';
        severity = 'ai';
        break;
      case 'faq_intercept':
        type = 'faq_intercept';
        title = 'FAQ answered';
        description = 'Predefined FAQ response sent';
        severity = 'info';
        break;
      case 'message_sent':
        type = 'workflow_triggered';
        title = 'Workflow triggered';
        description = meta.workflowName
          ? `"${meta.workflowName}" sent a DM`
          : 'Comment keyword automation ran';
        severity = 'success';
        break;
      default:
        type = 'dm_sent';
        break;
    }

    return {
      id: log.id,
      type,
      title,
      description,
      severity,
      createdAt: log.createdAt.toISOString(),
      metadata: meta,
    };
  }

  private buildChartData(
    start: Date,
    inbound: { sentAt: Date }[],
    outbound: { sentAt: Date; isAiGenerated: boolean }[],
    usageLogs: { type: string; count: number; createdAt: Date }[],
  ) {
    const dayMap = new Map<
      string,
      { day: string; dms: number; comments: number; aiReplies: number }
    >();
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dayMap.set(d.toDateString(), {
        day: DAY_LABELS[d.getDay()],
        dms: 0,
        comments: 0,
        aiReplies: 0,
      });
    }

    for (const m of inbound) {
      const bucket = dayMap.get(m.sentAt.toDateString());
      if (bucket) bucket.comments += 1;
    }
    for (const m of outbound) {
      const bucket = dayMap.get(m.sentAt.toDateString());
      if (bucket) {
        bucket.dms += 1;
        if (m.isAiGenerated) bucket.aiReplies += 1;
      }
    }
    for (const log of usageLogs) {
      const bucket = dayMap.get(log.createdAt.toDateString());
      if (!bucket) continue;
      if (log.type === 'message_sent') bucket.dms += log.count;
      if (log.type === 'ai_reply') bucket.aiReplies += log.count;
    }

    return Array.from(dayMap.values());
  }

  private buildFunnel(
    inbound: number,
    outbound: number,
    contacts: number,
    hotLeads: number,
  ) {
    const max = Math.max(inbound, outbound, contacts, hotLeads, 1);
    return [
      {
        stage: 'Inbound DMs',
        count: inbound,
        percent: Math.round((inbound / max) * 100),
      },
      {
        stage: 'Outbound sent',
        count: outbound,
        percent: Math.round((outbound / max) * 100),
      },
      {
        stage: 'Contacts',
        count: contacts,
        percent: Math.round((contacts / max) * 100),
      },
      {
        stage: 'Hot leads (50+)',
        count: hotLeads,
        percent: Math.round((hotLeads / max) * 100),
      },
    ];
  }

  private async ensureWorkspace(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace ${workspaceId} not found`);
    }
  }

  private truncate(text: string, max: number) {
    return text.length > max ? `${text.slice(0, max)}…` : text;
  }
}
