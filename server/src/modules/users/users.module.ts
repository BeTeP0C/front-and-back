import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PracticeUser } from './entities/practice-user.entity';
import { UsersService } from './users.service';
import { PracticeUsersService } from './practice-users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, PracticeUser])],
  controllers: [UsersController],
  providers: [UsersService, PracticeUsersService],
  exports: [UsersService, PracticeUsersService],
})
export class UsersModule {}
