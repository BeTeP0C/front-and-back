import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() category: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() price: number;
  @ApiPropertyOptional() image?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
