import { Controller, Get, Param, Logger } from '@nestjs/common';
import { AnalyticsService, WorkspaceDashboardStats } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':workspaceId')
  async getDashboardStats(
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceDashboardStats> {
    this.logger.log(`Fetching dashboard stats for workspaceId: ${workspaceId}`);
    return this.analyticsService.getWorkspaceDashboardStats(workspaceId);
  }
}
