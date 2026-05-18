/**
 * FILE: users.controller.ts
 * PURPOSE: Exposes user profile-related endpoints (current user, update profile)
 * 
 * DEPENDENCIES:
 * - NestJS Controller decorators
 * - UsersService
 * - DTO: UpdateUserDto
 * - Decorators/Guards for authentication
 * 
 * EXPORTS:
 * - UsersController class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define endpoints to get/update the authenticated user's profile.
 */

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    // Return full user with workspaces
    if (!req.user || !req.user.id) return { workspaces: [{ workspace: { id: 'temp' } }] };
    return this.usersService.findById(req.user.id);
  }
}

