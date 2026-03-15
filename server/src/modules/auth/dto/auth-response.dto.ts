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
  @ApiProperty({ description: 'Access токен для авторизации' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh токен для обновления' })
  refreshToken: string;
}

export class TokensResponseDto {
  @ApiProperty({ description: 'Access токен для авторизации' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh токен для обновления' })
  refreshToken: string;
}

export class RegisterResponseDto extends UserResponseDto {}
