'use client';

import { useState } from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import ConfirmModal from '@/components/ConfirmModal';
import styles from './Header.module.scss';

interface Props {
  onAddProduct?: () => void;
}

function Header({ onAddProduct }: Props) {
  const { user } = authStore;
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>TechStore</Link>
          <span className={styles.tagline}>Интернет-магазин</span>
        </div>
        <div className={styles.right}>
          {user && <span className={styles.greeting}>Привет, {user.first_name || user.email}!</span>}
          {authStore.isAdmin && (
            <>
              <Link href="/admin" className={styles.adminBtn}>Пользователи</Link>
              {onAddProduct && (
                <button className={styles.addBtn} onClick={onAddProduct}>+ Добавить</button>
              )}
            </>
          )}
          <button className={styles.logoutBtn} onClick={() => setLogoutOpen(true)}>Выйти</button>
        </div>
      </header>

      <ConfirmModal
        isOpen={logoutOpen}
        title="Выход"
        message="Вы уверены, что хотите выйти?"
        confirmText="Выйти"
        onConfirm={() => { setLogoutOpen(false); authStore.logout(); }}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}

export default observer(Header);
