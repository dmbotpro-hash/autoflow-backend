import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsNotEmpty()
  aiTone: string;

  @IsString()
  @IsNotEmpty()
  aiPrompt: string;
}

