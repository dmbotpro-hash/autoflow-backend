/**
 * FILE: login.dto.ts
 * PURPOSE: Data transfer object for login request payload
 * 
 * PROPS / INPUTS:
 * - email, password
 * 
 * DEPENDENCIES:
 * - class-validator decorators
 * 
 * EXPORTS:
 * - LoginDto class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define validation rules for email/password for login.
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

