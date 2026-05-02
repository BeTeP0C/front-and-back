import { makeAutoObservable, runInAction } from 'mobx';
import { authApi } from '@/api/auth';
import { clearTokens, hasTokens } from '@/api/client';
import type { User, LoginPayload, RegisterPayload } from '@/types';

class AuthStore {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuth(): boolean {
    return !!this.user;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  async checkAuth() {
    if (!hasTokens()) {
      runInAction(() => { this.loading = false; });
      return;
    }
    try {
      const user = await authApi.me();
      runInAction(() => { this.user = user; });
    } catch {
      clearTokens();
      runInAction(() => { this.user = null; });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async login(payload: LoginPayload) {
    this.error = null;
    try {
      await authApi.login(payload);
      const user = await authApi.me();
      runInAction(() => { this.user = user; });
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Ошибка входа';
      runInAction(() => { this.error = msg; });
      throw e;
    }
  }

  async register(payload: RegisterPayload) {
    this.error = null;
    try {
      await authApi.register(payload);
      await this.login({ email: payload.email, password: payload.password });
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Ошибка регистрации';
      runInAction(() => { this.error = msg; });
      throw e;
    }
  }

  async logout() {
    await authApi.logout();
    clearTokens();
    this.user = null;
  }

  clearError() {
    this.error = null;
  }
}

export const authStore = new AuthStore();
