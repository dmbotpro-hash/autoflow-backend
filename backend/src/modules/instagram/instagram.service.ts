/**
 * FILE: instagram.service.ts
 * PURPOSE: Implements Instagram account connection and related integration logic
 *
 * DEPENDENCIES:
 * - PrismaService (SocialAccount, Contact, Conversation, Message)
 * - Meta Graph API (to be implemented later)
 *
 * NOTE:
 * Session 5 requires minimal methods for AI auto-reply:
 * - findByInstagramAccountId()
 * - sendDM()
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Finds a SocialAccount by the Instagram page/account id.
   * This is used by webhook handler to map incoming events to a workspace.
   */
  async findByInstagramAccountId(instagramAccountId: string) {
    if (!instagramAccountId) return null;

    return this.prisma.socialAccount.findFirst({
      where: {
        platform: 'instagram',
        accountId: instagramAccountId,
        isActive: true,
      },
    });
  }

  /**
   * Sends a DM to a user.
   * MVP fallback: if Meta API integration is not implemented yet, we return false.
   */
  async sendDM(accessToken: string, instagramUserId: string, text: string) {
    this.logger.warn(
      `[InstagramService] sendDM called, but Meta Graph API integration is not implemented yet. instagramUserId=${instagramUserId}`,
    );

    // TODO: Implement Meta Graph API call.
    // For now, fail-safe to prevent broken behavior.
    if (!accessToken || !instagramUserId || !text) return false;
    return false;
  }

  /**
   * Public reply to a comment (used by workflow engine when publicReply is configured).
   */
  async replyToComment(
    _accessToken: string,
    _commentId: string,
    _text: string,
  ): Promise<boolean> {
    this.logger.warn(
      '[InstagramService] replyToComment called, but not implemented yet.',
    );
    return false;
  }
}

