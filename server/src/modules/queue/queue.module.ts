import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { bullMQConfig } from '../../config';
import { EmailProcessor } from './processors/email.processor';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot(bullMQConfig()),
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [EmailProcessor, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
