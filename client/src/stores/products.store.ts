import { makeAutoObservable, runInAction } from 'mobx';
import { productsApi } from '@/api/products';
import type { Product, CreateProductPayload, UpdateProductPayload } from '@/types';

class ProductsStore {
  items: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAll() {
    this.loading = true;
    this.error = null;
    try {
      const data = await productsApi.getAll();
      runInAction(() => { this.items = data; });
    } catch {
      runInAction(() => { this.error = 'Не удалось загрузить товары'; });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async create(payload: CreateProductPayload) {
    const product = await productsApi.create(payload);
    runInAction(() => { this.items.unshift(product); });
    return product;
  }

  async update(id: string, payload: UpdateProductPayload) {
    const updated = await productsApi.update(id, payload);
    runInAction(() => {
      this.items = this.items.map((p) => (p.id === id ? updated : p));
    });
    return updated;
  }

  async remove(id: string) {
    await productsApi.remove(id);
    runInAction(() => {
      this.items = this.items.filter((p) => p.id !== id);
    });
  }
}

export const productsStore = new ProductsStore();
