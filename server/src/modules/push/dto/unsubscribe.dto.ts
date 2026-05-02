import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnsubscribeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endpoint: string;
}
