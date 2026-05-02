'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import { productsApi } from '@/api/products';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner/Spinner';
import type { Product } from '@/types';
import styles from './page.module.scss';

const formatPrice = (v: number) => new Intl.NumberFormat('ru-RU').format(v);
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!authStore.user && !authStore.loading) {
      authStore.checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    setError(null);
    productsApi
      .getById(params.id)
      .then((data) => setProduct(data))
      .catch(() => setError('Товар не найден'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (authStore.loading) {
    return <Spinner fullPage text="Загрузка..." />;
  }

  if (!authStore.isAuth) {
    router.replace('/');
    return null;
  }

  const hasImg = product?.image && !imgError;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          ← Назад к товарам
        </button>

        {loading && <Spinner text="Загрузка товара..." />}

        {error && (
          <div className={styles.error}>
            <span>{error}</span>
            <button className={styles.retryBtn} onClick={() => router.push('/')}>
              Вернуться
            </button>
          </div>
        )}

        {!loading && !error && product && (
          <div className={styles.detail}>
            <div className={styles.imageSection}>
              {hasImg ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.image}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.placeholder}>
                  <span>{product.category}</span>
                </div>
              )}
            </div>

            <div className={styles.info}>
              <span className={styles.category}>{product.category}</span>
              <h1 className={styles.title}>{product.title}</h1>

              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              <div className={styles.priceBlock}>
                <span className={styles.price}>{formatPrice(product.price)} ₽</span>
              </div>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Добавлен</span>
                  <span className={styles.metaValue}>{formatDate(product.createdAt)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Обновлён</span>
                  <span className={styles.metaValue}>{formatDate(product.updatedAt)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>ID</span>
                  <span className={styles.metaValueMono}>{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>© {new Date().getFullYear()} TechStore</footer>
    </div>
  );
}

export default observer(ProductDetailPage);
