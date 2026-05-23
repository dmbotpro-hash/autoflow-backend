import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService) {}

  async listSessions(userId: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        deviceLabel: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
    });
    return tokens.map((t) => ({
      id: t.id,
      device: t.deviceLabel ?? this.parseDevice(t.userAgent),
      userAgent: t.userAgent,
      createdAt: t.createdAt,
      expiresAt: t.expiresAt,
      current: false,
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    const result = await this.prisma.refreshToken.deleteMany({
      where: { id: sessionId, userId },
    });
    if (!result.count) throw new NotFoundException('Session not found');
    return { success: true };
  }

  async revokeAllSessions(userId: string, exceptToken?: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        ...(exceptToken ? { token: { not: exceptToken } } : {}),
      },
    });
    return { success: true };
  }

  async listLoginHistory(userId: string, limit = 30) {
    return this.prisma.loginEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        device: true,
        success: true,
        createdAt: true,
      },
    });
  }

  private parseDevice(userAgent?: string | null): string {
    if (!userAgent) return 'Unknown device';
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac/i.test(userAgent)) return 'Mac';
    if (/linux/i.test(userAgent)) return 'Linux';
    return 'Browser';
  }
}
