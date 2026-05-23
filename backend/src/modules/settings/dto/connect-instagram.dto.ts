import { IsOptional, IsString } from 'class-validator';

export class ConnectInstagramDto {
  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;
}

