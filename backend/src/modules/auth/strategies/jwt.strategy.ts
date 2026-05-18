/**
 * FILE: jwt.strategy.ts
 * PURPOSE: Passport JWT strategy for validating JWT access tokens
 * 
 * DEPENDENCIES:
 * - PassportStrategy (nestjs/passport)
 * - Strategy (passport-jwt)
 * - JwtConfig
 * 
 * EXPORTS:
 * - JwtStrategy class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement JWT strategy validation callback to attach user to req.
 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret', // fallback for dev
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        workspaces: true, // ADD THIS — workspaceId har request mein available hoga
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

