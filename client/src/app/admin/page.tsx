'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import { adminApi, AdminUser } from '@/api/admin';
import Header from '@/components/Header';
import styles from './page.module.scss';

function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authStore.loading && !authStore.isAuth) {
      router.replace('/');
      return;
    }
    if (!authStore.loading && !authStore.isAdmin) {
      router.replace('/');
      return;
    }
  }, [authStore.loading, authStore.isAuth, authStore.isAdmin, router]);

  useEffect(() => {
    if (!authStore.isAdmin) return;
    setLoading(true);
    setError(null);
    adminApi
      .getUsers()
      .then((data) => setUsers(data))
      .catch(() => setError('Не удалось загрузить пользователей'))
      .finally(() => setLoading(false));
  }, [authStore.isAdmin]);

  const handleRoleChange = async (id: string, role: 'user' | 'admin') => {
    try {
      const updated = await adminApi.updateRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)),
      );
    } catch {
      setError('Не удалось изменить роль');
    }
  };

  if (authStore.loading) {
    return <div className={styles.status}>Загрузка...</div>;
  }

  if (!authStore.isAdmin) return null;

  const currentUserId = authStore.user?.id;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Управление пользователями</h1>
        <p className={styles.subtitle}>Назначайте роли пользователям системы</p>

        {loading && <div className={styles.status}>Загрузка...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <div className={styles.list}>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <div key={u.id} className={styles.userCard}>
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
                        isSelf
                          ? styles.roleOptionDisabled
                          : u.role === 'user'
                            ? styles.roleOptionActiveUser
                            : styles.roleOption
                      }
                      onClick={() => !isSelf && handleRoleChange(u.id, 'user')}
                      disabled={isSelf}
                    >
                      user
                    </button>
                    <button
                      className={
                        isSelf
                          ? styles.roleOptionDisabled
                          : u.role === 'admin'
                            ? styles.roleOptionActiveAdmin
                            : styles.roleOption
                      }
                      onClick={() => !isSelf && handleRoleChange(u.id, 'admin')}
                      disabled={isSelf}
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
