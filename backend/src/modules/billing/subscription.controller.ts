import { Controller, Post, HttpCode, HttpStatus, Body, Req, Headers, Logger } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('billing')
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

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
