import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { PushModule } from '../push/push.module';

@Module({
  imports: [PushModule],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
