import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'member'])
  role?: 'admin' | 'member';
}
