import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';
import type { ActivityEventDto, AnalyticsOverview } from './analytics.types';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats(@WorkspaceId() workspaceId: string) {
    return this.analyticsService.getWorkspaceDashboardStats(workspaceId);
  }

  @Get('overview')
  async getOverview(
    @WorkspaceId() workspaceId: string,
  ): Promise<AnalyticsOverview> {
    this.logger.log(`Analytics overview for ${workspaceId}`);
    return this.analyticsService.getOverview(workspaceId);
  }

  @Get('events')
  async getEvents(
    @WorkspaceId() workspaceId: string,
    @Query('limit') limit?: string,
  ): Promise<ActivityEventDto[]> {
    const n = limit ? Math.min(100, parseInt(limit, 10) || 40) : 40;
    return this.analyticsService.getEvents(workspaceId, n);
  }
}
