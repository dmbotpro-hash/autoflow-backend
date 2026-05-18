import { Controller, Get, Query, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('webhook/instagram')
export class WebhookController {
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
    @Res() res: Response,
  ) {
    const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'YOUR_VERIFY_TOKEN'; // Replace with your actual verify token
    if (mode === 'subscribe' && verifyToken === META_VERIFY_TOKEN) {
      res.status(HttpStatus.OK).send(challenge);
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Verification token mismatch');
    }
  }
}