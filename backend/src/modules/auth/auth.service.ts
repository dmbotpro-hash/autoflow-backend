import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import * as crypto from 'crypto';

import { PrismaService } from '../../prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';



type SessionMeta = { userAgent?: string; ipAddress?: string; deviceLabel?: string };



@Injectable()

export class AuthService {

  constructor(

    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,

  ) {}



  async register(dto: RegisterDto, meta?: SessionMeta) {

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existing) throw new BadRequestException('Email already in use');



    const passwordHash = await bcrypt.hash(dto.password, 10);

    const orgSlug = `${dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-org-${Date.now()}`;

    const wsSlug = `${dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;



    const user = await this.prisma.user.create({

      data: {

        email: dto.email,

        passwordHash,

        name: dto.name,

        workspaces: {

          create: {

            role: 'owner',

            workspace: {

              create: {

                name: `${dto.name}'s Workspace`,

                slug: wsSlug,

                organization: {

                  create: {

                    name: `${dto.name}'s Organization`,

                    slug: orgSlug,

                  },

                },

              },

            },

          },

        },

      },

      include: { workspaces: { include: { workspace: true } } },

    });



    await this.recordLogin(user.id, true, meta);

    return this.generateTokens(user, meta);

  }



  async login(dto: LoginDto, meta?: SessionMeta) {

    const user = await this.prisma.user.findUnique({

      where: { email: dto.email },

      include: { workspaces: { include: { workspace: true } } },

    });

    if (!user || !user.passwordHash) {

      if (user) await this.recordLogin(user.id, false, meta);

      throw new UnauthorizedException('Invalid credentials');

    }



    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isMatch) {

      await this.recordLogin(user.id, false, meta);

      throw new UnauthorizedException('Invalid credentials');

    }



    await this.recordLogin(user.id, true, meta);

    return this.generateTokens(user, meta);

  }



  async refreshToken(token: string, meta?: SessionMeta) {

    const record = await this.prisma.refreshToken.findUnique({

      where: { token },

      include: { user: { include: { workspaces: { include: { workspace: true } } } } },

    });



    if (!record || record.expiresAt < new Date()) {

      throw new UnauthorizedException('Invalid or expired refresh token');

    }



    await this.prisma.refreshToken.delete({ where: { id: record.id } });



    return this.generateTokens(record.user, meta);

  }



  async logout(refreshToken: string) {

    if (!refreshToken) return { success: true };



    await this.prisma.refreshToken.deleteMany({

      where: { token: refreshToken },

    });



    return { success: true };

  }



  private async recordLogin(userId: string, success: boolean, meta?: SessionMeta) {

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

    } catch {

      /* non-blocking */

    }

  }



  private parseDevice(userAgent?: string): string {

    if (!userAgent) return 'Unknown';

    if (/mobile/i.test(userAgent)) return 'Mobile';

    if (/windows/i.test(userAgent)) return 'Windows';

    if (/mac/i.test(userAgent)) return 'Mac';

    return 'Browser';

  }



  private async generateTokens(user: { id: string; email: string; name: string }, meta?: SessionMeta) {

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });



    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);



    const refreshToken = await this.prisma.refreshToken.create({

      data: {

        userId: user.id,

        token: crypto.randomBytes(40).toString('hex'),

        expiresAt,

        userAgent: meta?.userAgent,

        deviceLabel: meta?.deviceLabel ?? this.parseDevice(meta?.userAgent),

      },

    });



    return {

      user: {

        id: user.id,

        email: user.email,

        name: user.name,

      },

      accessToken,

      refreshToken: refreshToken.token,

    };

  }

}

