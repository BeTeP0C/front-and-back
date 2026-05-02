import apiClient from './client';

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
};
