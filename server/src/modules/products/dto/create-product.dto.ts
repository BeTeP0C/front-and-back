import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Название товара',
    example: 'Умные часы Premium',
  })
  @IsString()
  @IsNotEmpty({ message: 'Название товара обязательно' })
  title: string;

  @ApiProperty({
    description: 'Категория товара',
    example: 'Часы',
  })
  @IsString()
  @IsNotEmpty({ message: 'Категория обязательна' })
  category: string;

  @ApiPropertyOptional({
    description: 'Описание товара',
    example: 'Стильные умные часы с AMOLED дисплеем',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Цена товара в рублях',
    example: 12990,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @ApiPropertyOptional({
    description: 'URL изображения товара',
    example: 'https://example.com/watch.jpg',
  })
  @IsUrl({}, { message: 'Некорректный URL изображения' })
  @IsOptional()
  image?: string;
}
