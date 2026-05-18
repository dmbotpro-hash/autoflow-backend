/**
 * FILE: ai.module.ts
 * PURPOSE: Registers AI service provider(s) for generating DM replies and spam detection
 * 
 * DEPENDENCIES:
 * - NestJS Module decorator
 * - AiService
 * 
 * EXPORTS:
 * - AiModule class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Wire AiService and any prompt/template providers.
 */

import { Module } from '@nestjs/common';
import { AiService } from './ai.service';


@Module({
  providers: [AiService],
  exports: [AiService],
})
export class AIModule {}



