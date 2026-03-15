import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID товара' })
  id: string;

  @ApiProperty({ description: 'Название товара' })
  title: string;

  @ApiProperty({ description: 'Категория товара' })
  category: string;

  @ApiPropertyOptional({ description: 'Описание товара' })
  description?: string;

  @ApiProperty({ description: 'Цена товара в рублях' })
  price: number;

  @ApiPropertyOptional({ description: 'URL изображения товара' })
  image?: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}
