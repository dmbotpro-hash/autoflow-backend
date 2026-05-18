/**
 * FILE: auth.module.ts
 * PURPOSE: Registers authentication providers (controllers/services/strategies) for the AutoFlow backend
 * 
 * DEPENDENCIES:
 * - NestJS Module decorator
 * - AuthController, AuthService
 * - JWT strategy + Google strategy shells
 * 
 * EXPORTS:
 * - AuthModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Wire AuthService, AuthController, and strategies into Nest dependency graph.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

