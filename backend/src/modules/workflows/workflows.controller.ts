/**
 * FILE: workflows.controller.ts
 * PURPOSE: Exposes workflow CRUD endpoints for the current workspace
 * 
 * DEPENDENCIES:
 * - NestJS Controller decorators
 * - WorkflowsService
 * - DTOs: CreateWorkflowDto, UpdateWorkflowDto
 * 
 * EXPORTS:
 * - WorkflowsController class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define routes for list/create/get/update/activate workflows.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Post()
  async create(@WorkspaceId() workspaceId: string, @Body() dto: CreateWorkflowDto) {
    if (!workspaceId) throw new BadRequestException('Workspace not found');
    console.log(`[WorkflowsController] create workflow workspaceId=${workspaceId}`);
    return this.workflowsService.create(workspaceId, dto);
  }

  @Get()
  async findAll(@WorkspaceId() workspaceId: string) {
    if (!workspaceId) throw new BadRequestException('Workspace not found');
    return this.workflowsService.findAll(workspaceId);
  }

  @Get(':id')
  async findOne(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    if (!workspaceId) throw new BadRequestException('Workspace not found');
    return this.workflowsService.findOne(workspaceId, id);
  }

  @Put(':id')
  async update(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDto,
  ) {
    if (!workspaceId) throw new BadRequestException('Workspace not found');
    return this.workflowsService.update(workspaceId, id, dto);
  }

  @Patch(':id/toggle')
  async toggle(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    if (!workspaceId) throw new BadRequestException('Workspace not found');
    return this.workflowsService.toggleActive(workspaceId, id);
  }

  @Delete(':id')
  async remove(@WorkspaceId() workspaceId: string, @Param('id') id: string) {
    if (!workspaceId) throw new BadRequestException('Workspace not found');
    return this.workflowsService.remove(workspaceId, id);
  }
}


