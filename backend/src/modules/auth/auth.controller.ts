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

import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}

