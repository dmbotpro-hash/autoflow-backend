import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  list(@Request() req: { user: { id: string } }) {
    return this.workspacesService.listForUser(req.user.id);
  }

  @Get('organization')
  getOrganization(@Request() req: { user: { id: string } }) {
    return this.workspacesService.getOrganizationForUser(req.user.id);
  }

  @Post()
  create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.createForUser(req.user.id, dto);
  }

  @Get('members')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  listMembers(@WorkspaceId() workspaceId: string) {
    return this.workspacesService.listMembers(workspaceId);
  }

  @Get('invites')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  listInvites(@WorkspaceId() workspaceId: string) {
    return this.workspacesService.listInvites(workspaceId);
  }

  @Post('invites')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  invite(
    @WorkspaceId() workspaceId: string,
    @Request() req: { user: { id: string } },
    @Body() dto: InviteMemberDto,
  ) {
    return this.workspacesService.createInvite(
      workspaceId,
      req.user.id,
      dto.email,
      dto.role ?? 'member',
    );
  }

  @Delete('invites/:id')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  revokeInvite(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.workspacesService.revokeInvite(workspaceId, id);
  }

  @Post('invites/accept')
  acceptInvite(
    @Request() req: { user: { id: string; email: string } },
    @Body() body: { token: string },
  ) {
    return this.workspacesService.acceptInvite(
      body.token,
      req.user.id,
      req.user.email,
    );
  }

  @Delete('members/:userId')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  removeMember(
    @WorkspaceId() workspaceId: string,
    @Request() req: { user: { id: string } },
    @Param('userId') userId: string,
  ) {
    return this.workspacesService.removeMember(
      workspaceId,
      userId,
      req.user.id,
    );
  }
}
