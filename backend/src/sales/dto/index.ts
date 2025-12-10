import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsNumber()
  @Min(0)
  total: number;

  @IsEnum(['CREDIT', 'DEBIT', 'PIX', 'CASH', 'BANK_SLIP'])
  payment: string;

  @IsString()
  @IsOptional()
  customerId?: string;
}