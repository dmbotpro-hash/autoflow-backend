import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

function sessionMeta(req: Request) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const userAgent = req.headers['user-agent'];

  return {
    userAgent: typeof userAgent === 'string' ? userAgent : undefined,
    ipAddress:
      typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : req.ip || req.socket?.remoteAddress,
    deviceLabel: undefined,
  };
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    return this.authService.health();
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    try {
      this.logger.log(`Register request received for ${dto.email}`);
      return await this.authService.register(dto, sessionMeta(req));
    } catch (error) {
      this.logger.error(
        `Register endpoint error for ${dto.email}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Registration failed. Please try again.');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    try {
      this.logger.log(`Login request received for ${dto.email}`);
      return await this.authService.login(dto, sessionMeta(req));
    } catch (error) {
      this.logger.error(
        `Login endpoint error for ${dto.email}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Login failed. Please try again.');
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string, @Req() req: Request) {
    try {
      this.logger.log('Refresh token request received');

      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      return await this.authService.refreshToken(refreshToken, sessionMeta(req));
    } catch (error) {
      this.logger.error(
        `Refresh endpoint error: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Token refresh failed. Please login again.');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken?: string) {
    try {
      this.logger.log('Logout request received');
      return await this.authService.logout(refreshToken || '');
    } catch (error) {
      this.logger.error(
        `Logout endpoint error: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { success: true };
    }
  }
}
