import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScheduleReminderDto {
  @ApiProperty({ example: 'Напоминание' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Не забудьте проверить новые товары!' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: 30, description: 'Задержка в секундах (5–3600)' })
  @IsNumber()
  @Min(5)
  @Max(3600)
  delaySeconds: number;

  @ApiPropertyOptional({ example: '/' })
  @IsOptional()
  @IsString()
  url?: string;
}
