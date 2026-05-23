/**
 * FILE: http-exception.filter.ts
 * PURPOSE: Global HTTP exception filter for consistent API error responses
 * HANDLES: Database errors, validation errors, auth errors, and general server errors
 * 
 * DEPENDENCIES:
 * - ExceptionFilter (NestJS)
 * - HttpException
 * - ArgumentsHost
 * 
 * EXPORTS:
 * - HttpExceptionFilter class
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;

      // Handle specific database connection errors
      if (message.includes('ECONNREFUSED')) {
        this.logger.error('❌ Database connection refused - check DATABASE_URL and Supabase status');
        message = 'Database connection failed. Check server logs for details.';
        status = HttpStatus.SERVICE_UNAVAILABLE;
      } else if (message.includes('P1000')) {
        // Prisma: Authentication failed against database server
        this.logger.error('❌ Database authentication failed');
        message = 'Database authentication failed. Check DATABASE_URL credentials.';
        status = HttpStatus.SERVICE_UNAVAILABLE;
      } else if (message.includes('P1002')) {
        // Prisma: The provided database string is invalid
        this.logger.error('❌ Invalid database connection string');
        message = 'Invalid DATABASE_URL format. Check environment variables.';
        status = HttpStatus.SERVICE_UNAVAILABLE;
      } else if (message.includes('timeout')) {
        this.logger.error('❌ Database query timeout');
        message = 'Request timeout. Please try again.';
        status = HttpStatus.REQUEST_TIMEOUT;
      } else if (message.includes('JWT') || message.includes('secret')) {
        this.logger.error('❌ JWT configuration error - check JWT_SECRET');
        message = 'Authentication configuration error. Check server logs.';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else {
        this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
      }
    } else {
      this.logger.error(`Unknown error type: ${exception}`);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse['details'] = exception instanceof Error ? exception.stack : String(exception);
    }

    this.logger.warn(
      `API Error [${status}] ${request.method} ${request.url} - ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}

