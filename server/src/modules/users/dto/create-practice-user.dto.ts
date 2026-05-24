import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePracticeUserDto {
  @ApiProperty({ example: 'Ivan' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Petrov' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 24 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;
}
