import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { Throttle } from '@nestjs/throttler';

@Controller('webhook/instagram')
@Throttle({ default: { limit: 500, ttl: 60000 } })
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN =
      process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN ||
      process.env.META_WEBHOOK_VERIFY_TOKEN;

    if (!VERIFY_TOKEN) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Webhook verify token not configured');
    }
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      this.logger.log('Webhook verified successfully');
      return res.status(HttpStatus.OK).send(challenge);
    }
    return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
  }

  @Post()
  async receiveWebhook(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Meta webhook event received');

    this.webhookService.processWebhook(req.body).catch((err: any) => {
      this.logger.error(
        `Background webhook processing failed: ${err?.message ?? err}`,
      );
    });

    return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
  }
}
