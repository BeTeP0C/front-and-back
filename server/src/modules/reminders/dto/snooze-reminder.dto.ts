import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SnoozeReminderDto {
  @ApiProperty({ example: 'uuid-of-reminder' })
  @IsString()
  @IsNotEmpty()
  reminderId: string;
}
