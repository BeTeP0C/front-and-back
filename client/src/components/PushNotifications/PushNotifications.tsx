'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import { pushApi } from '@/api/push';
import styles from './PushNotifications.module.scss';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) {
    view[i] = raw.charCodeAt(i);
  }
  return buffer;
}

function PushNotifications() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setSupported(true);
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    setSubscribed(!!sub);
  }, []);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const vapidKey = await pushApi.getVapidKey();
      if (!vapidKey) return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await pushApi.subscribe(sub.toJSON());
      setSubscribed(true);
    } catch (err) {
      console.error('Push subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await pushApi.unsubscribe(sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (err) {
      console.error('Push unsubscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPush = async () => {
    setTestSending(true);
    try {
      await pushApi.sendTestPush();
    } catch (err) {
      console.error('Test push error:', err);
    } finally {
      setTestSending(false);
    }
  };

  if (!supported || !authStore.user) return null;

  const permission = typeof Notification !== 'undefined' ? Notification.permission : 'default';

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={`${styles.bellBtn} ${subscribed ? styles.bellBtnActive : ''}`}
        onClick={() => setOpen(!open)}
        title="Уведомления"
      >
        <span className={styles.bellIcon}>{subscribed ? '🔔' : '🔕'}</span>
        {subscribed && <span className={styles.dot} />}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>Уведомления</div>

          <div className={styles.dropdownBody}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Статус</span>
              <span className={`${styles.statusValue} ${subscribed ? styles.statusOn : styles.statusOff}`}>
                {subscribed ? 'Включены' : 'Отключены'}
              </span>
            </div>

            {permission === 'denied' && (
              <div className={styles.warning}>
                Уведомления заблокированы в браузере. Разрешите их в настройках сайта.
              </div>
            )}

            {!subscribed ? (
              <button
                className={styles.actionBtn}
                onClick={handleSubscribe}
                disabled={loading || permission === 'denied'}
              >
                {loading ? 'Подключение...' : 'Включить уведомления'}
              </button>
            ) : (
              <button
                className={styles.actionBtnDanger}
                onClick={handleUnsubscribe}
                disabled={loading}
              >
                {loading ? 'Отключение...' : 'Отключить уведомления'}
              </button>
            )}

            {authStore.isAdmin && subscribed && (
              <>
                <div className={styles.divider} />
                <div className={styles.adminSection}>
                  <span className={styles.adminLabel}>Панель админа</span>
                  <button
                    className={styles.testBtn}
                    onClick={handleTestPush}
                    disabled={testSending}
                  >
                    {testSending ? 'Отправка...' : '📨 Тестовый push'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(PushNotifications);
