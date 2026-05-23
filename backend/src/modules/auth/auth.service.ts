import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type SessionMeta = { userAgent?: string; ipAddress?: string; deviceLabel?: string };

type AuthUser = {
  id: string;
  email: string;
  name: string;
  passwordHash?: string | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  health() {
    return {
      status: this.prisma.isConnected() ? 'ok' : 'degraded',
      database: this.prisma.isConnected() ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  async register(dto: RegisterDto, meta?: SessionMeta) {
    this.prisma.assertDatabaseAvailable();

    try {
      this.logger.log(`Register attempt for ${dto.email}`);

      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase().trim() },
      });

      if (existing) {
        this.logger.warn(`Register failed because email already exists: ${dto.email}`);
        throw new BadRequestException('Email already in use');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const slugBase = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'workspace';
      const timestamp = Date.now();

      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase().trim(),
          passwordHash,
          name: dto.name.trim(),
          workspaces: {
            create: {
              role: 'owner',
              workspace: {
                create: {
                  name: `${dto.name.trim()}'s Workspace`,
                  slug: `${slugBase}-${timestamp}`,
                  organization: {
                    create: {
                      name: `${dto.name.trim()}'s Organization`,
                      slug: `${slugBase}-org-${timestamp}`,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await this.recordLogin(user.id, true, meta);
      this.logger.log(`User registered successfully: ${user.id}`);
      return await this.generateTokens(user, meta);
    } catch (error) {
      this.handleAuthError('register', error, dto.email);
    }
  }

  async login(dto: LoginDto, meta?: SessionMeta) {
    this.prisma.assertDatabaseAvailable();

    try {
      const normalizedEmail = dto.email.toLowerCase().trim();
      this.logger.log(`Login attempt for ${normalizedEmail}`);

      const user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user?.passwordHash) {
        this.logger.warn(`Login failed for ${normalizedEmail}: user not found or password missing`);
        if (user?.id) {
          await this.recordLogin(user.id, false, meta);
        }
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isMatch) {
        this.logger.warn(`Login failed for ${normalizedEmail}: password mismatch`);
        await this.recordLogin(user.id, false, meta);
        throw new UnauthorizedException('Invalid email or password');
      }

      await this.recordLogin(user.id, true, meta);
      this.logger.log(`User logged in successfully: ${user.id}`);
      return await this.generateTokens(user, meta);
    } catch (error) {
      this.handleAuthError('login', error, dto.email);
    }
  }

  async refreshToken(token: string, meta?: SessionMeta) {
    this.prisma.assertDatabaseAvailable();

    try {
      this.logger.log('Refresh token attempt');

      const record = await this.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!record) {
        this.logger.warn('Refresh token not found');
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (record.expiresAt < new Date()) {
        this.logger.warn(`Refresh token expired for user ${record.userId}`);
        await this.prisma.refreshToken.delete({ where: { id: record.id } });
        throw new UnauthorizedException('Refresh token has expired');
      }

      await this.prisma.refreshToken.delete({ where: { id: record.id } });
      return await this.generateTokens(record.user, meta);
    } catch (error) {
      this.handleAuthError('refreshToken', error);
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return { success: true };
    }

    try {
      if (!this.prisma.isConnected()) {
        this.logger.warn('Logout requested while database is unavailable; returning success without token cleanup');
        return { success: true };
      }

      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Logout error: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { success: true };
    }
  }

  private async recordLogin(userId: string, success: boolean, meta?: SessionMeta) {
    if (!this.prisma.isConnected()) {
      return;
    }

    try {
      await this.prisma.loginEvent.create({
        data: {
          userId,
          success,
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
          device: meta?.deviceLabel ?? this.parseDevice(meta?.userAgent),
        },
      });
    } catch (error) {
      this.logger.warn(
        `Failed to record login event for ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private parseDevice(userAgent?: string) {
    if (!userAgent) return 'Unknown';
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac/i.test(userAgent)) return 'Mac';
    if (/linux/i.test(userAgent)) return 'Linux';
    return 'Browser';
  }

  private async generateTokens(user: AuthUser, meta?: SessionMeta) {
    try {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      const refreshTokenValue = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date();

      expiresAt.setDate(expiresAt.getDate() + 7);

      const refreshToken = await this.createRefreshToken(user.id, refreshTokenValue, expiresAt, meta);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken: refreshToken.token,
      };
    } catch (error) {
      this.logger.error(
        `Token generation error for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Failed to generate authentication tokens');
    }
  }

  private handleAuthError(action: string, error: unknown, email?: string): never {
    const label = email ? `${action}:${email}` : action;

    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException ||
      error instanceof ServiceUnavailableException
    ) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    if (
      this.isPrismaSchemaMismatch(error) ||
      message.includes('P2021') ||
      message.includes('P2022') ||
      message.includes('column') ||
      message.includes('does not exist')
    ) {
      this.logger.error(`Database schema mismatch during ${label}: ${message}`, stack);
      throw new ServiceUnavailableException('Database schema is updating. Please try again shortly.');
    }

    if (
      message.includes('P1000') ||
      message.includes('P1001') ||
      message.includes('P1002') ||
      message.includes('connect') ||
      message.includes('ECONNREFUSED')
    ) {
      this.logger.error(`Database error during ${label}: ${message}`, stack);
      throw new ServiceUnavailableException('Database is unavailable. Please try again shortly.');
    }

    this.logger.error(`Unexpected auth error during ${label}: ${message}`, stack);
    throw new InternalServerErrorException('Authentication request failed. Please try again.');
  }

  private async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    meta?: SessionMeta,
  ) {
    try {
      return await this.prisma.refreshToken.create({
        data: {
          userId,
          token,
          expiresAt,
          userAgent: meta?.userAgent,
          deviceLabel: meta?.deviceLabel ?? this.parseDevice(meta?.userAgent),
        },
      });
    } catch (error) {
      if (!this.isPrismaSchemaMismatch(error)) {
        throw error;
      }

      this.logger.warn(
        `RefreshToken metadata columns are unavailable; retrying token creation without optional fields for user ${userId}`,
      );

      return this.prisma.refreshToken.create({
        data: {
          userId,
          token,
          expiresAt,
        },
      });
    }
  }

  private isPrismaSchemaMismatch(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return error.code === 'P2021' || error.code === 'P2022';
    }

    const message = error instanceof Error ? error.message : String(error);
    return (
      message.includes('P2021') ||
      message.includes('P2022') ||
      message.includes('The table') ||
      message.includes('The column') ||
      message.includes('does not exist')
    );
  }
}
