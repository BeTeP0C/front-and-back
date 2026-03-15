import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя' })
  id: string;

  @ApiProperty({ description: 'Email пользователя' })
  email: string;

  @ApiProperty({ description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ description: 'Фамилия пользователя' })
  last_name: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Успешность авторизации' })
  success: boolean;

  @ApiProperty({ description: 'Данные пользователя', type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: 'JWT токен для авторизации', required: false })
  access_token?: string;
}

export class RegisterResponseDto extends UserResponseDto {}
