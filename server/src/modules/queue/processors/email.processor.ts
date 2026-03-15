import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<void> {
    this.logger.log(`Processing email job ${job.id}`);
    
    const { to, subject, body } = job.data;
    
    // Здесь будет логика отправки email
    // Например, через nodemailer или другой сервис
    this.logger.log(`Sending email to ${to}: ${subject}`);
    
    // Симуляция отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.logger.log(`Email sent successfully to ${to}`);
  }
}
