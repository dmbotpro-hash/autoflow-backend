/**
 * FILE: auth.service.ts
 * PURPOSE: Handles all authentication logic — register, login, token refresh, logout
 * 
 * DEPENDENCIES:
 * - UsersService (find/create user)
 * - JwtService (sign/verify tokens)
 * - bcrypt (password hashing)
 * - PrismaService (database)
 * 
 * EXPORTS:
 * - AuthService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement register(): hash password, create user in DB, return tokens
 * - Implement login(): validate credentials, return JWT + refresh token
 * - Implement refreshToken(): verify refresh token, issue new access token
 * - Implement logout(): invalidate refresh token in DB
 */

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        workspaces: {
          create: {
            workspace: {
              create: {
                name: `${dto.name}'s Workspace`,
                slug: `${dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
              }
            }
          }
        }
      },
      include: { workspaces: { include: { workspace: true } } }
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ 
      where: { email: dto.email },
      include: { workspaces: { include: { workspace: true } } }
    });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { workspaces: { include: { workspace: true } } } } }
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.generateTokens(record.user);
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    // Check if user has an existing unexpired refresh token, or create a new one
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: require('crypto').randomBytes(40).toString('hex'),
        expiresAt,
      }
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

