'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import styles from './ProductCard.module.scss';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const formatPrice = (v: number) => new Intl.NumberFormat('ru-RU').format(v);

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const [imgError, setImgError] = useState(false);
  const hasImg = product.image && !imgError;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {hasImg ? (
          <img src={product.image} alt={product.title} className={styles.image} onError={() => setImgError(true)} />
        ) : (
          <div className={styles.placeholder}>{product.category}</div>
        )}
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h2 className={styles.title}>{product.title}</h2>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)} ₽</span>
          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => onEdit(product)}>✏️</button>
            <button className={styles.btnDel} onClick={() => onDelete(product.id)}>🗑️</button>
          </div>
        </div>
      </div>
    </article>
  );
}
