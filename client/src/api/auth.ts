import apiClient, { saveTokens } from './client';
import type { User, LoginPayload, RegisterPayload, TokensResponse } from '@/types';

export const authApi = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await apiClient.post<User>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<TokensResponse> {
    const { data } = await apiClient.post<TokensResponse>('/auth/login', payload);
    saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};
