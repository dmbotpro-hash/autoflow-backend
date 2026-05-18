/**
 * FILE: register.dto.ts
 * PURPOSE: Data transfer object for register request payload
 * 
 * PROPS / INPUTS:
 * - email, password, name
 * 
 * DEPENDENCIES:
 * - class-validator decorators
 * 
 * EXPORTS:
 * - RegisterDto class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Define validation rules for register fields.
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

