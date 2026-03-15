'use client';

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore, productsStore } from '@/stores';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import ConfirmModal from '@/components/ConfirmModal';
import type { Product, CreateProductPayload } from '@/types';
import styles from './page.module.scss';

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => { authStore.checkAuth(); }, []);
  useEffect(() => { if (authStore.isAuth) productsStore.fetchAll(); }, [authStore.isAuth]);

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    try { await authStore.login({ email, password }); }
    finally { setAuthLoading(false); }
  };

  const handleRegister = async (data: { email: string; password: string; first_name: string; last_name: string }) => {
    setAuthLoading(true);
    try { await authStore.register(data); }
    finally { setAuthLoading(false); }
  };

  const openCreate = () => { setModalMode('create'); setEditProduct(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setModalMode('edit'); setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(null); };

  const handleDeleteClick = (id: string) => {
    const p = productsStore.items.find((x) => x.id === id) || null;
    setDeleteTarget(p); setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await productsStore.remove(deleteTarget.id);
    setConfirmOpen(false); setDeleteTarget(null);
  };

  const handleSubmitModal = async (data: CreateProductPayload & { id?: string }) => {
    if (modalMode === 'create') {
      await productsStore.create(data);
    } else if (data.id) {
      await productsStore.update(data.id, data);
    }
    closeModal();
  };

  if (authStore.loading) {
    return <div className={styles.status}>Загрузка...</div>;
  }

  if (!authStore.isAuth) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} error={authStore.error} loading={authLoading} />;
  }

  return (
    <div className={styles.page}>
      <Header onAddProduct={openCreate} />

      <main className={styles.main}>
        {productsStore.loading && <div className={styles.status}>Загрузка товаров...</div>}
        {productsStore.error && (
          <div className={styles.statusError}>
            {productsStore.error}
            <button className={styles.retryBtn} onClick={() => productsStore.fetchAll()}>Повторить</button>
          </div>
        )}
        {!productsStore.loading && !productsStore.error && productsStore.items.length === 0 && (
          <div className={styles.status}>Товаров пока нет. Добавьте первый!</div>
        )}
        {productsStore.items.length > 0 && (
          <div className={styles.grid}>
            {productsStore.items.map((p) => (
              <ProductCard key={p.id} product={p} onEdit={openEdit} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>© {new Date().getFullYear()} TechStore</footer>

      <ProductModal isOpen={modalOpen} mode={modalMode} product={editProduct} onClose={closeModal} onSubmit={handleSubmitModal} />
      <ConfirmModal
        isOpen={confirmOpen}
        title="Удалить товар?"
        message={deleteTarget ? `Удалить «${deleteTarget.title}»? Действие нельзя отменить.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteTarget(null); }}
      />
    </div>
  );
}

export default observer(HomePage);
