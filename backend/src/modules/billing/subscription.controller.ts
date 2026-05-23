import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Headers,
  Logger,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { WorkspaceId } from '../../common/decorators/workspace-id.decorator';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('usage')
  getUsage(@WorkspaceId() workspaceId: string) {
    return this.subscriptionService.getWorkspaceUsage(workspaceId);
  }

  @Post('checkout')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  checkout(
    @WorkspaceId() workspaceId: string,
    @Body() body: { plan?: string },
  ) {
    const plan = body.plan === 'AGENCY' ? 'AGENCY' : 'PRO';
    return this.subscriptionService.createCheckoutSession(workspaceId, plan);
  }

  @Post('upgrade')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  async upgrade(
    @WorkspaceId() workspaceId: string,
    @Body() body: { plan?: string; sessionId?: string },
  ) {
    const plan = body.plan?.toUpperCase();
    if (!plan || !['FREE', 'PRO', 'AGENCY'].includes(plan)) {
      throw new BadRequestException('Invalid plan');
    }
    const updated = await this.subscriptionService.upgradePlan(
      workspaceId,
      plan as 'FREE' | 'PRO' | 'AGENCY',
    );
    return {
      success: true,
      plan: updated.plan,
      subscriptionStatus: updated.subscriptionStatus,
      sessionId: body.sessionId ?? null,
    };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleBillingWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Received billing webhook payload.');
    // Boilerplate integration shell for future webhook processing
    return { received: true };
  }
}
