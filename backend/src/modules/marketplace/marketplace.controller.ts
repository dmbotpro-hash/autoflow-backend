import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('templates')
  listTemplates() {
    return this.marketplaceService.listTemplates();
  }

  @Post('templates/:id/install')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  install(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.marketplaceService.installTemplate(workspaceId, id);
  }
}
