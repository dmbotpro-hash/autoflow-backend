/**
 * FILE: webhook-event.dto.ts
 * PURPOSE: Data transfer object representing a Meta webhook event payload
 * 
 * PROPS / INPUTS:
 * - Raw webhook event payload fields
 * 
 * DEPENDENCIES:
 * - class-validator decorators (optional)
 * 
 * EXPORTS:
 * - WebhookEventDto class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Model the webhook payload structure used for comment-to-DM triggers.
 */

import { IsArray, IsObject, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class WebhookMessage {
  @IsObject()
  sender: { id: string };

  @IsObject()
  recipient: { id: string };

  @IsNumber()
  timestamp: number;

  @IsOptional()
  @IsObject()
  message?: { mid: string; text: string };
}

export class WebhookChange {
  @IsString()
  field: string;

  @IsObject()
  value: {
    media_id?: string;
    comment_id?: string;
    text?: string;
    from?: { id: string; username?: string };
    id?: string;
  };
}

export class WebhookEntry {
  @IsString()
  id: string;

  @IsNumber()
  time: number;

  @IsArray()
  @ValidateNested({ each: true })
  changes: WebhookChange[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  messaging?: WebhookMessage[];
}

export class WebhookEventDto {
  @IsString()
  object: string;

  @IsArray()
  @ValidateNested({ each: true })
  entry: WebhookEntry[];
}



