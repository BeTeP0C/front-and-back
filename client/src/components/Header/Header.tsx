'use client';

import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import styles from './Header.module.scss';

interface Props {
  onAddProduct: () => void;
}

function Header({ onAddProduct }: Props) {
  const { user } = authStore;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.logo}>TechStore</h1>
        <span className={styles.tagline}>Интернет-магазин</span>
      </div>
      <div className={styles.right}>
        {user && <span className={styles.greeting}>Привет, {user.first_name || user.email}!</span>}
        <button className={styles.addBtn} onClick={onAddProduct}>+ Добавить</button>
        <button className={styles.logoutBtn} onClick={() => authStore.logout()}>Выйти</button>
      </div>
    </header>
  );
}

export default observer(Header);
