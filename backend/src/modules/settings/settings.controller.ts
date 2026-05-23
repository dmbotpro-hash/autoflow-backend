import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ConnectInstagramDto } from './dto/connect-instagram.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@WorkspaceId() workspaceId: string) {
    return this.settingsService.getSettings(workspaceId);
  }

  @Post()
  updateSettings(
    @WorkspaceId() workspaceId: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.settingsService.updateSettings(workspaceId, dto);
  }

  @Post('instagram/connect')
  connectInstagram(
    @WorkspaceId() workspaceId: string,
    @Body() dto: ConnectInstagramDto,
  ) {
    return this.settingsService.connectInstagram(workspaceId, dto);
  }

  @Post('instagram/disconnect')
  disconnectInstagram(@WorkspaceId() workspaceId: string) {
    return this.settingsService.disconnectInstagram(workspaceId);
  }

  @Post('onboarding/complete')
  completeOnboarding(@WorkspaceId() workspaceId: string) {
    return this.settingsService.completeOnboarding(workspaceId);
  }
}

