import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PushKeys {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class SubscribeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  expirationTime?: number | null;

  @ApiProperty({ type: PushKeys })
  @ValidateNested()
  @Type(() => PushKeys)
  keys: PushKeys;
}
