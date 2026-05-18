/**
 * FILE: workflows.service.ts
 * PURPOSE: Implements business logic for storing and managing workflows and nodes
 * 
 * DEPENDENCIES:
 * - PrismaService (Workflow, WorkflowNode)
 * 
 * EXPORTS:
 * - WorkflowsService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement methods to create/update workflows and their nodes.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {

  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateWorkflowDto) {
    if (!workspaceId) {
      throw new NotFoundException('Workspace not found');
    }

    console.log(`[WorkflowsService] create workspaceId=${workspaceId} name=${dto.name}`);

    return this.prisma.workflow.create({
      data: {
        workspaceId,
        name: dto.name,
        trigger: dto.trigger,
        isActive: dto.isActive ?? false,
        config: dto.config as any,
      },
    });
  }

  async findAll(workspaceId: string) {
    return this.prisma.workflow.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(workspaceId: string, id: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, workspaceId, deletedAt: null },
    });

    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  async update(workspaceId: string, id: string, dto: UpdateWorkflowDto) {
    await this.findOne(workspaceId, id);

    return this.prisma.workflow.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.config !== undefined ? { config: dto.config as any } : {}),
      },
    });
  }

  async toggleActive(workspaceId: string, id: string) {
    const workflow = await this.findOne(workspaceId, id);

    return this.prisma.workflow.update({
      where: { id },
      data: { isActive: !workflow.isActive },
    });
  }

  async remove(workspaceId: string, id: string) {
    await this.findOne(workspaceId, id);

    return this.prisma.workflow.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}


