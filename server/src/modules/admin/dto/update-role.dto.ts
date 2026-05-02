import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class UpdateRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole, { message: 'Роль должна быть "user" или "admin"' })
  role: UserRole;
}
