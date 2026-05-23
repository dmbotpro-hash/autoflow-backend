import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  @HttpCode(HttpStatus.OK)
  health() {
    return {
      status: 'healthy',
      service: 'AutoFlow API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/version')
  @HttpCode(HttpStatus.OK)
  version() {
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
