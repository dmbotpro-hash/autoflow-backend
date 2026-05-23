/**
 * FILE: contacts.module.ts
 * PURPOSE: Registers contacts controller/service for managing CRM-style contacts
 * 
 * DEPENDENCIES:
 * - NestJS Module decorator
 * - ContactsController, ContactsService
 * 
 * EXPORTS:
 * - ContactsModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Wire ContactsService for use by workflows/webhook processing.
 */

import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}


