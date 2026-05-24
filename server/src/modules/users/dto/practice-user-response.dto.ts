import { ApiProperty } from '@nestjs/swagger';

export class PracticeUserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ivan' })
  first_name: string;

  @ApiProperty({ example: 'Petrov' })
  last_name: string;

  @ApiProperty({ example: 24 })
  age: number;

  @ApiProperty({ example: 1748090400 })
  created_at: number;

  @ApiProperty({ example: 1748090500 })
  updated_at: number;
}
