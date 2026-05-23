/**
 * FILE: jwt.strategy.ts
 * PURPOSE: Passport JWT strategy for validating JWT access tokens
 * ENSURES: JWT secret matches auth module configuration
 * 
 * DEPENDENCIES:
 * - PassportStrategy (nestjs/passport)
 * - Strategy (passport-jwt)
 * - JwtConfig
 * 
 * EXPORTS:
 * - JwtStrategy class
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });

    this.logger.log('✅ JWT Strategy initialized with environment secret');
  }

  async validate(payload: { sub: string; email: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          workspaces: { include: { workspace: true } },
        },
      });

      if (!user) {
        this.logger.warn(`JWT validation failed: User not found (${payload.sub})`);
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `JWT validation error: ${error instanceof Error ? error.message : error}`,
      );
      throw new UnauthorizedException('Token validation failed');
    }
  }
}

