import apiClient from './client';

export interface ReminderResponse {
  id: string;
  title: string;
  body: string;
  url: string;
  fireAt: string;
}

export const pushApi = {
  async getVapidKey(): Promise<string | null> {
    const { data } = await apiClient.get<{ key: string | null }>('/push/vapid-key');
    return data.key;
  },

  async subscribe(subscription: PushSubscriptionJSON): Promise<void> {
    await apiClient.post('/push/subscribe', subscription);
  },

  async unsubscribe(endpoint: string): Promise<void> {
    await apiClient.post('/push/unsubscribe', { endpoint });
  },

  async sendTestPush(): Promise<void> {
    await apiClient.post('/push/test');
  },

  async scheduleReminder(title: string, body: string, delaySeconds: number): Promise<ReminderResponse> {
    const { data } = await apiClient.post<ReminderResponse>('/reminders/schedule', {
      title,
      body,
      delaySeconds,
    });
    return data;
  },

  async getReminders(): Promise<ReminderResponse[]> {
    const { data } = await apiClient.get<ReminderResponse[]>('/reminders');
    return data;
  },

  async cancelReminder(id: string): Promise<void> {
    await apiClient.delete(`/reminders/${id}`);
  },
};
