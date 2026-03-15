'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Product, CreateProductPayload } from '@/types';
import styles from './ProductModal.module.scss';

interface Props {
  isOpen: boolean;
  mode: 'create' | 'edit';
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: CreateProductPayload & { id?: string }) => void;
}

const empty = { title: '', category: '', description: '', price: '', image: '' };

export default function ProductModal({ isOpen, mode, product, onClose, onSubmit }: Props) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (mode === 'edit' && product) {
        setForm({
          title: product.title,
          category: product.category,
          description: product.description || '',
          price: String(product.price),
          image: product.image || '',
        });
      } else {
        setForm(empty);
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, mode, product]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form, price: Number(form.price) };
    if (mode === 'edit' && product) payload.id = product.id;
    onSubmit(payload);
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{mode === 'create' ? 'Добавить товар' : 'Редактировать'}</h2>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} placeholder="URL изображения" value={form.image} onChange={set('image')} />
          <input className={styles.input} placeholder="Название" value={form.title} onChange={set('title')} required />
          <input className={styles.input} placeholder="Категория" value={form.category} onChange={set('category')} required />
          <textarea className={styles.textarea} placeholder="Описание" value={form.description} onChange={set('description')} rows={3} />
          <input className={styles.input} type="number" placeholder="Цена (₽)" value={form.price} onChange={set('price')} required min={0} />
          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Отмена</button>
            <button type="submit" className={styles.btnSubmit}>{mode === 'create' ? 'Создать' : 'Сохранить'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
