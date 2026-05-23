/**
 * FILE: auth.controller.ts
 * PURPOSE: Exposes HTTP endpoints for register, login, refresh token, logout, and OAuth flows
 * 
 * DEPENDENCIES:
 * - NestJS Controller decorators
 * - AuthService
 * - DTOs: LoginDto, RegisterDto, RefreshTokenDto
 * 
 * EXPORTS:
 * - AuthController class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define route handlers for auth flows and delegate to AuthService.
 */

import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

function sessionMeta(req: Request) {
  const ua = req.headers['user-agent'];
  return {
    userAgent: typeof ua === 'string' ? ua : undefined,
    ipAddress: req.ip || req.socket?.remoteAddress,
    deviceLabel: undefined,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, sessionMeta(req));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, sessionMeta(req));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string, @Req() req: Request) {
    return this.authService.refreshToken(refreshToken, sessionMeta(req));
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }
}

