'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import { adminApi, AdminUser } from '@/api/admin';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner/Spinner';
import styles from './page.module.scss';

function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { loading: authLoading, isAuth, isAdmin } = authStore;

  useEffect(() => {
    if (!authLoading && !isAuth) {
      router.replace('/');
      return;
    }
    if (!authLoading && isAuth && !isAdmin) {
      router.replace('/');
      return;
    }
  }, [authLoading, isAuth, isAdmin, router]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    adminApi
      .getUsers()
      .then((data) => setUsers(data))
      .catch(() => setError('Не удалось загрузить пользователей'))
      .finally(() => setLoading(false));
  }, [authLoading, isAdmin]);

  useEffect(() => {
    if (!authStore.user) {
      authStore.checkAuth();
    }
  }, []);

  const handleRoleChange = async (id: string, role: 'user' | 'admin') => {
    setUpdatingId(id);
    try {
      const updated = await adminApi.updateRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)),
      );
    } catch {
      setError('Не удалось изменить роль');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return <Spinner fullPage text="Загрузка..." />;
  }

  if (!isAdmin) return null;

  const currentUserId = authStore.user?.id;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Управление пользователями</h1>
        <p className={styles.subtitle}>Назначайте роли пользователям системы</p>

        {loading && <Spinner text="Загрузка пользователей..." />}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <div className={styles.list}>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isUpdating = updatingId === u.id;
              const disabled = isSelf || isUpdating;
              return (
                <div key={u.id} className={`${styles.userCard} ${isUpdating ? styles.userCardUpdating : ''}`}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>
                      {u.first_name} {u.last_name}
                      {isSelf && <span className={styles.selfBadge}>вы</span>}
                    </span>
                    <span className={styles.userEmail}>{u.email}</span>
                    <span className={styles.userMeta}>
                      Создан: {new Date(u.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className={styles.roleToggle}>
                    <button
                      className={
                        disabled
                          ? styles.roleOptionDisabled
                          : u.role === 'user'
                            ? styles.roleOptionActiveUser
                            : styles.roleOption
                      }
                      onClick={() => !disabled && handleRoleChange(u.id, 'user')}
                      disabled={disabled}
                    >
                      user
                    </button>
                    <button
                      className={
                        disabled
                          ? styles.roleOptionDisabled
                          : u.role === 'admin'
                            ? styles.roleOptionActiveAdmin
                            : styles.roleOption
                      }
                      onClick={() => !disabled && handleRoleChange(u.id, 'admin')}
                      disabled={disabled}
                    >
                      admin
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className={styles.footer}>© {new Date().getFullYear()} TechStore</footer>
    </div>
  );
}

export default observer(AdminPage);
