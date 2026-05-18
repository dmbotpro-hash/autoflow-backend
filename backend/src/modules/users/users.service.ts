/**
 * FILE: users.service.ts
 * PURPOSE: Implements business logic for user profile retrieval and updates
 * 
 * DEPENDENCIES:
 * - PrismaService (User model access)
 * 
 * EXPORTS:
 * - UsersService class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement methods to find user by id/email, update profile, and soft-delete behaviors if needed.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { workspaces: { include: { workspace: true } } },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { workspaces: { include: { workspace: true } } },
    });
  }
}

