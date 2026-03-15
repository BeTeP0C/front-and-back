import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Умные часы Premium' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Часы' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 'Стильные умные часы с AMOLED дисплеем' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 12990 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'https://example.com/watch.jpg' })
  @IsUrl()
  @IsOptional()
  image?: string;
}
