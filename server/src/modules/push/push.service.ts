import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webPush from 'web-push';
import { PushSubscription } from './entities/push-subscription.entity';
import { SubscribeDto } from './dto';

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);

  constructor(
    @InjectRepository(PushSubscription)
    private readonly subscriptionRepo: Repository<PushSubscription>,
  ) {}

  onModuleInit() {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (publicKey && privateKey) {
      webPush.setVapidDetails(
        'mailto:admin@techstore.com',
        publicKey,
        privateKey,
      );
      this.logger.log('VAPID keys configured');
    } else {
      this.logger.warn(
        'VAPID keys not set — push notifications disabled. Run: npm run vapid',
      );
    }
  }

  async subscribe(dto: SubscribeDto): Promise<PushSubscription> {
    const existing = await this.subscriptionRepo.findOne({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      existing.keys = JSON.stringify(dto.keys);
      return this.subscriptionRepo.save(existing);
    }

    const sub = this.subscriptionRepo.create({
      endpoint: dto.endpoint,
      keys: JSON.stringify(dto.keys),
    });
    return this.subscriptionRepo.save(sub);
  }

  async unsubscribe(endpoint: string): Promise<void> {
    await this.subscriptionRepo.delete({ endpoint });
  }

  async sendToAll(title: string, body: string, url?: string, reminderId?: string): Promise<void> {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      this.logger.warn('Cannot send push: VAPID keys not configured');
      return;
    }

    const apiBase = process.env.CORS_ORIGIN
      ? `http://localhost:${process.env.PORT || 4000}`
      : 'http://localhost:4000';

    const subscriptions = await this.subscriptionRepo.find();
    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      ...(reminderId && { reminderId, apiBase }),
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) => {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: JSON.parse(sub.keys),
        };
        return webPush.sendNotification(pushSub, payload);
      }),
    );

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      this.logger.warn(`${failed.length}/${subscriptions.length} push sends failed`);
      for (const result of failed) {
        const reason = (result as PromiseRejectedResult).reason;
        if (reason?.statusCode === 410 || reason?.statusCode === 404) {
          const sub = subscriptions[results.indexOf(result)];
          await this.subscriptionRepo.delete({ endpoint: sub.endpoint });
          this.logger.log(`Removed expired subscription: ${sub.endpoint.slice(0, 50)}...`);
        }
      }
    }
  }

  getVapidPublicKey(): string | null {
    return process.env.VAPID_PUBLIC_KEY || null;
  }
}
