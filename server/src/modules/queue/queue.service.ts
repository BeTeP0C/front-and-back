import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async addEmailJob(to: string, subject: string, body: string) {
    const job = await this.emailQueue.add('send-email', {
      to,
      subject,
      body,
    });
    this.logger.log(`Added email job ${job.id}`);
    return job;
  }

  async addNotificationJob(userId: string, message: string) {
    const job = await this.notificationsQueue.add('send-notification', {
      userId,
      message,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Added notification job ${job.id}`);
    return job;
  }
}
