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
import { withRetry } from '../../common/utils/retry.util';

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
   */
  async sendDM(accessToken: string, instagramUserId: string, text: string): Promise<boolean> {
    if (!accessToken || !instagramUserId || !text) {
      this.logger.warn('[InstagramService] Missing required fields for sendDM');
      return false;
    }

    const url = `https://graph.instagram.com/v21.0/me/messages`;
    const payload = {
      recipient: { id: instagramUserId },
      message: { text },
    };

    try {
      return await withRetry(async () => {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(`Meta Graph API error: ${res.statusText} (${JSON.stringify(body)})`);
        }

        const data: any = await res.json();
        if (data?.error) {
          throw new Error(`Meta Graph API error: ${JSON.stringify(data.error)}`);
        }

        this.logger.log(`[InstagramService] DM sent successfully to ${instagramUserId}`);
        return true;
      });
    } catch (error: any) {
      this.logger.error(`[InstagramService] sendDM final delivery failed: ${error?.message ?? error}`);
      return false;
    }
  }

  /**
   * Public reply to a comment (used by workflow engine when publicReply is configured).
   */
  async replyToComment(
    accessToken: string,
    commentId: string,
    text: string,
  ): Promise<boolean> {
    if (!accessToken || !commentId || !text) {
      this.logger.warn('[InstagramService] Missing required fields for replyToComment');
      return false;
    }

    const url = `https://graph.instagram.com/v21.0/${commentId}/replies`;
    const payload = {
      message: text,
    };

    try {
      return await withRetry(async () => {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(`Meta Graph API error: ${res.statusText} (${JSON.stringify(body)})`);
        }

        const data: any = await res.json();
        if (data?.error) {
          throw new Error(`Meta Graph API error: ${JSON.stringify(data.error)}`);
        }

        this.logger.log(`[InstagramService] Replied to comment ${commentId} successfully`);
        return true;
      });
    } catch (error: any) {
      this.logger.error(`[InstagramService] replyToComment final delivery failed: ${error?.message ?? error}`);
      return false;
    }
  }
}

