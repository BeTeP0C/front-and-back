import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя (используется как логин)',
    example: 'ivan@example.com',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Петров',
  })
  @IsString()
  @IsNotEmpty({ message: 'Фамилия обязательна' })
  last_name: string;

  @ApiProperty({
    description: 'Пароль (минимум 6 символов)',
    example: 'qwerty123',
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}
