import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PushService } from '../push/push.service';

export interface Reminder {
  id: string;
  title: string;
  body: string;
  url: string;
  fireAt: Date;
  timerId: ReturnType<typeof setTimeout>;
}

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);
  private readonly reminders = new Map<string, Reminder>();
  private counter = 0;

  constructor(private readonly pushService: PushService) {}

  schedule(title: string, body: string, delaySeconds: number, url = '/'): Omit<Reminder, 'timerId'> {
    const id = `rem_${++this.counter}_${Date.now()}`;
    const fireAt = new Date(Date.now() + delaySeconds * 1000);

    const timerId = setTimeout(() => {
      this.fire(id);
    }, delaySeconds * 1000);

    const reminder: Reminder = { id, title, body, url, fireAt, timerId };
    this.reminders.set(id, reminder);

    this.logger.log(`Scheduled reminder "${title}" in ${delaySeconds}s (id=${id})`);

    return { id, title, body, url, fireAt };
  }

  snooze(reminderId: string): Omit<Reminder, 'timerId'> {
    const existing = this.reminders.get(reminderId);

    const SNOOZE_SECONDS = 300;
    const fireAt = new Date(Date.now() + SNOOZE_SECONDS * 1000);

    if (existing) {
      clearTimeout(existing.timerId);

      existing.fireAt = fireAt;
      existing.timerId = setTimeout(() => {
        this.fire(reminderId);
      }, SNOOZE_SECONDS * 1000);

      this.logger.log(`Snoozed reminder "${existing.title}" for 5 min (id=${reminderId})`);

      return { id: existing.id, title: existing.title, body: existing.body, url: existing.url, fireAt: existing.fireAt };
    }

    const id = reminderId;
    const title = 'Напоминание';
    const body = 'Отложенное уведомление';
    const url = '/';

    const timerId = setTimeout(() => {
      this.fire(id);
    }, SNOOZE_SECONDS * 1000);

    const reminder: Reminder = { id, title, body, url, fireAt, timerId };
    this.reminders.set(id, reminder);

    this.logger.log(`Created snoozed reminder (id=${id})`);

    return { id, title, body, url, fireAt };
  }

  getAll(): Omit<Reminder, 'timerId'>[] {
    return Array.from(this.reminders.values()).map(({ timerId, ...rest }) => rest);
  }

  cancel(id: string): void {
    const reminder = this.reminders.get(id);
    if (!reminder) {
      throw new NotFoundException('Напоминание не найдено');
    }
    clearTimeout(reminder.timerId);
    this.reminders.delete(id);
    this.logger.log(`Cancelled reminder "${reminder.title}" (id=${id})`);
  }

  private fire(id: string): void {
    const reminder = this.reminders.get(id);
    if (!reminder) return;

    this.logger.log(`Firing reminder "${reminder.title}" (id=${id})`);
    this.reminders.delete(id);

    this.pushService
      .sendToAll(reminder.title, reminder.body, reminder.url, id)
      .catch((err) => this.logger.error(`Failed to send reminder push: ${err.message}`));
  }
}
