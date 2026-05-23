import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(workspaceId: string, q: string, limit = 8) {
    const term = q.trim();
    if (!term || term.length < 2) {
      return { contacts: [], workflows: [], conversations: [] };
    }

    const take = Math.min(20, Math.max(1, limit));

    const [contacts, workflows, conversations] = await Promise.all([
      this.prisma.contact.findMany({
        where: {
          workspaceId,
          deletedAt: null,
          OR: [
            { username: { contains: term, mode: 'insensitive' } },
            { name: { contains: term, mode: 'insensitive' } },
            { instagramId: { contains: term, mode: 'insensitive' } },
          ],
        },
        take,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          username: true,
          name: true,
          leadScore: true,
        },
      }),
      this.prisma.workflow.findMany({
        where: {
          workspaceId,
          deletedAt: null,
          name: { contains: term, mode: 'insensitive' },
        },
        take,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          trigger: true,
          isActive: true,
        },
      }),
      this.prisma.conversation.findMany({
        where: {
          workspaceId,
          OR: [
            {
              contact: {
                username: { contains: term, mode: 'insensitive' },
              },
            },
            {
              contact: {
                name: { contains: term, mode: 'insensitive' },
              },
            },
          ],
        },
        take,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          status: true,
          contact: {
            select: { username: true, name: true },
          },
        },
      }),
    ]);

    return {
      contacts: contacts.map((c) => ({
        id: c.id,
        label: c.username || c.name || 'Unknown',
        sublabel: c.name && c.username ? c.name : `Score ${c.leadScore}`,
        href: `/contacts`,
      })),
      workflows: workflows.map((w) => ({
        id: w.id,
        label: w.name,
        sublabel: w.isActive ? 'Active' : 'Paused',
        href: `/workflows`,
      })),
      conversations: conversations.map((c) => ({
        id: c.id,
        label: c.contact?.username || c.contact?.name || 'Conversation',
        sublabel: c.status,
        href: `/inbox`,
      })),
    };
  }
}
