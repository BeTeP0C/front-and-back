import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'ivan@example.com' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Иван' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Петров' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'qwerty123' })
  @IsString()
  @MinLength(6, { message: 'Минимум 6 символов' })
  @IsNotEmpty()
  password: string;
}
