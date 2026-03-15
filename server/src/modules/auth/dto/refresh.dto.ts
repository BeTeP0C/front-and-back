import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'Refresh токен для обновления' })
  @IsNotEmpty({ message: 'refreshToken is required' })
  @IsString()
  refreshToken: string;
}
