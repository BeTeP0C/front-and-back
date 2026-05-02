import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() first_name: string;
  @ApiProperty() last_name: string;
  @ApiProperty() role: string;
}

export class LoginResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}

export class TokensResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}
