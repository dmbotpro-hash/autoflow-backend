/**
 * FILE: users.module.ts
 * PURPOSE: Registers users controller/service providers for the AutoFlow backend
 * 
 * DEPENDENCIES:
 * - NestJS Module decorator
 * - UsersController, UsersService
 * 
 * EXPORTS:
 * - UsersModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Wire UsersService/UsersController and export UsersService for Auth module usage.
 */

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

