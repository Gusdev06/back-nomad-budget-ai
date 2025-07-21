import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsIn(['INCOME', 'EXPENSE'])
  type: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  expenseDate?: Date;
}