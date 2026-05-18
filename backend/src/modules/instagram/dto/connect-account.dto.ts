/**
 * FILE: connect-account.dto.ts
 * PURPOSE: Data transfer object for connecting an Instagram account
 * 
 * PROPS / INPUTS:
 * - workspaceId
 * - accountId / accountName (as applicable)
 * - accessToken (if supplied)
 * 
 * DEPENDENCIES:
 * - class-validator decorators
 * 
 * EXPORTS:
 * - ConnectAccountDto class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define validation rules for required Instagram connection payload fields.
 */

import { IsString, MinLength } from 'class-validator';

export class ConnectAccountDto {
  @IsString()
  @MinLength(10)
  accessToken: string;

  @IsString()
  @MinLength(1)
  instagramAccountId: string;

  @IsString()
  @MinLength(1)
  accountName: string;
}


