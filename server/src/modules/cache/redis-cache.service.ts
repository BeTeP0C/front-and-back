import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from '../../config';

export const USERS_CACHE_TTL = 60;
export const PRODUCTS_CACHE_TTL = 600;

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly client: Redis;
  private isReady = false;

  constructor() {
    const config = redisConfig();
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.logger.log('Redis cache connected');
    });

    this.client.on('end', () => {
      this.isReady = false;
      this.logger.warn('Redis cache disconnected');
    });

    this.client.on('error', (err) => {
      this.isReady = false;
      this.logger.warn(`Redis cache error: ${err.message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      this.logger.warn(`Redis cache is unavailable: ${message}`);
    }
  }

  async onModuleDestroy() {
    if (this.client.status === 'ready') {
      await this.client.quit();
      return;
    }

    if (this.client.status !== 'end') {
      this.client.disconnect();
    }
  }

  getUsersListKey(): string {
    return 'users:list';
  }

  getUserItemKey(userId: number): string {
    return `users:item:${userId}`;
  }

  getProductsListKey(category?: string, search?: string): string {
    const categoryPart = encodeURIComponent(
      (category || '').trim().toLowerCase(),
    );
    const searchPart = encodeURIComponent((search || '').trim().toLowerCase());
    return `products:list:${categoryPart}:${searchPart}`;
  }

  getProductItemKey(productId: string): string {
    return `products:item:${productId}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isReady) return null;
    try {
      const cached = await this.client.get(key);
      return cached ? (JSON.parse(cached) as T) : null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      this.logger.warn(`Cache read failed for key "${key}": ${message}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!this.isReady) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      this.logger.warn(`Cache write failed for key "${key}": ${message}`);
    }
  }

  async delete(...keys: string[]): Promise<void> {
    if (!this.isReady) return;
    const validKeys = keys.filter(Boolean);
    if (validKeys.length === 0) return;
    try {
      await this.client.del(...validKeys);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      this.logger.warn(`Cache delete failed: ${message}`);
    }
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    if (!this.isReady) return;
    let cursor = '0';
    try {
      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          'MATCH',
          `${prefix}*`,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      this.logger.warn(`Cache prefix delete failed for "${prefix}": ${message}`);
    }
  }

  async invalidateUsers(userId?: number): Promise<void> {
    const listKey = this.getUsersListKey();
    if (userId !== undefined) {
      await this.delete(listKey, this.getUserItemKey(userId));
      return;
    }
    await this.delete(listKey);
  }

  async invalidateProducts(productId?: string): Promise<void> {
    await this.deleteByPrefix('products:list:');
    if (productId) {
      await this.delete(this.getProductItemKey(productId));
    }
  }
}
