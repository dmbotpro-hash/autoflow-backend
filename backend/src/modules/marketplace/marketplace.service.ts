import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MARKETPLACE_TEMPLATES } from './marketplace.templates';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  listTemplates() {
    return MARKETPLACE_TEMPLATES;
  }

  async installTemplate(workspaceId: string, templateId: string) {
    const template = MARKETPLACE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) throw new NotFoundException('Template not found');

    return this.prisma.workflow.create({
      data: {
        workspaceId,
        name: template.name,
        trigger: template.trigger,
        isActive: false,
        config: template.config,
      },
    });
  }
}
