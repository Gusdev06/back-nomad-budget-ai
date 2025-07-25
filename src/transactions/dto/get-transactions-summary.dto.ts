import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class GetTransactionsSummaryDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  currency?: string;
} 