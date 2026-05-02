'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import { pushApi, ReminderResponse } from '@/api/push';
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

function formatFireAt(iso: string): string {
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  if (diff <= 0) return 'сейчас';
  const sec = Math.ceil(diff / 1000);
  if (sec < 60) return `через ${sec} сек`;
  const min = Math.ceil(sec / 60);
  return `через ${min} мин`;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'только что';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} мин назад`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ч назад`;
  return `${Math.floor(hr / 24)} дн назад`;
}

interface NotifEntry {
  id: string;
  title: string;
  body: string;
  timestamp: number;
}

const HISTORY_KEY = 'techstore_notif_history';
const MAX_HISTORY = 50;

function loadHistory(): NotifEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: NotifEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

type Tab = 'history' | 'settings' | 'scheduler';

function PushNotifications() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [tab, setTab] = useState<Tab>('history');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [schedTitle, setSchedTitle] = useState('');
  const [schedBody, setSchedBody] = useState('');
  const [schedDelay, setSchedDelay] = useState('30');
  const [scheduling, setScheduling] = useState(false);
  const [schedSuccess, setSchedSuccess] = useState('');

  const [reminders, setReminders] = useState<ReminderResponse[]>([]);
  const [history, setHistory] = useState<NotifEntry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setSupported(true);
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    setSubscribed(!!sub);
  }, []);

  useEffect(() => {
    checkSubscription();
    setHistory(loadHistory());
  }, [checkSubscription]);

  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const seen = new Set<string>();

    const addEntry = (title: string, body: string) => {
      const dedupKey = `${title}|${body}|${Math.floor(Date.now() / 2000)}`;
      if (seen.has(dedupKey)) return;
      seen.add(dedupKey);

      const entry: NotifEntry = {
        id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: title || 'TechStore',
        body: body || '',
        timestamp: Date.now(),
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY);
        saveHistory(next);
        return next;
      });
      if (!openRef.current) setUnreadCount((c) => c + 1);
    };

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'PUSH_RECEIVED') {
        addEntry(event.data.title, event.data.body);
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('techstore_push');
      bc.onmessage = handler;
    } catch { /* BroadcastChannel not supported */ }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handler);
    }

    return () => {
      bc?.close();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handler);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadReminders = useCallback(async () => {
    if (!authStore.isAdmin) return;
    try {
      const data = await pushApi.getReminders();
      setReminders(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (open && authStore.isAdmin && subscribed) loadReminders();
    if (open) setUnreadCount(0);
  }, [open, subscribed, loadReminders]);

  useEffect(() => {
    if (!open || !authStore.isAdmin || reminders.length === 0) return;
    const interval = setInterval(() => setReminders((r) => [...r]), 1000);
    return () => clearInterval(interval);
  }, [open, reminders.length]);

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

  const handleSchedule = async () => {
    if (!schedTitle.trim() || !schedBody.trim()) return;
    const delay = parseInt(schedDelay, 10);
    if (isNaN(delay) || delay < 5) return;
    setScheduling(true);
    setSchedSuccess('');
    try {
      await pushApi.scheduleReminder(schedTitle.trim(), schedBody.trim(), delay);
      setSchedSuccess(`Запланировано через ${delay} сек`);
      setSchedTitle('');
      setSchedBody('');
      setSchedDelay('30');
      loadReminders();
      setTimeout(() => setSchedSuccess(''), 3000);
    } catch (err) {
      console.error('Schedule error:', err);
    } finally {
      setScheduling(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await pushApi.cancelReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Cancel reminder error:', err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  if (!supported || !authStore.user) return null;

  const permission = typeof Notification !== 'undefined' ? Notification.permission : 'default';
  const isAdmin = authStore.isAdmin;
  const tabs: { key: Tab; label: string }[] = [
    { key: 'history', label: 'История' },
    { key: 'settings', label: 'Настройки' },
    ...(isAdmin ? [{ key: 'scheduler' as Tab, label: 'Планировщик' }] : []),
  ];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={`${styles.bellBtn} ${subscribed ? styles.bellBtnActive : ''}`}
        onClick={() => setOpen(!open)}
        title="Уведомления"
      >
        <span className={styles.bellIcon}>{subscribed ? '🔔' : '🔕'}</span>
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span>Уведомления</span>
            <span className={`${styles.statusValue} ${subscribed ? styles.statusOn : styles.statusOff}`}>
              {subscribed ? 'Вкл' : 'Откл'}
            </span>
          </div>

          <div className={styles.tabRow}>
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.dropdownBody}>
            {/* ===== HISTORY TAB ===== */}
            {tab === 'history' && (
              <div className={styles.historySection}>
                {history.length > 0 && (
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Последние</span>
                    <button className={styles.clearBtn} onClick={clearHistory}>Очистить</button>
                  </div>
                )}
                {history.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🔕</span>
                    <span className={styles.emptyText}>Уведомлений пока нет</span>
                  </div>
                ) : (
                  history.map((n) => (
                    <div key={n.id} className={styles.historyItem}>
                      <div className={styles.historyIcon}>🔔</div>
                      <div className={styles.historyContent}>
                        <span className={styles.historyItemTitle}>{n.title}</span>
                        <span className={styles.historyItemBody}>{n.body}</span>
                        <span className={styles.historyItemTime}>{formatTimeAgo(n.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== SETTINGS TAB ===== */}
            {tab === 'settings' && (
              <>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Push-уведомления</span>
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

                {isAdmin && subscribed && (
                  <button
                    className={styles.actionBtn}
                    onClick={handleTestPush}
                    disabled={testSending}
                    style={{ marginTop: '0.25rem' }}
                  >
                    {testSending ? 'Отправка...' : '📨 Отправить тестовый push'}
                  </button>
                )}
              </>
            )}

            {/* ===== SCHEDULER TAB (admin) ===== */}
            {tab === 'scheduler' && isAdmin && (
              <div className={styles.adminSection}>
                <div className={styles.scheduler}>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>✏️</span>
                    <input
                      className={styles.input}
                      placeholder="Заголовок уведомления"
                      value={schedTitle}
                      onChange={(e) => setSchedTitle(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>💬</span>
                    <textarea
                      className={styles.textarea}
                      placeholder="Текст уведомления..."
                      value={schedBody}
                      onChange={(e) => setSchedBody(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>⏱️</span>
                    <div className={styles.delayGroup}>
                      <input
                        className={styles.delayInput}
                        type="number"
                        min={5}
                        max={3600}
                        placeholder="30"
                        value={schedDelay}
                        onChange={(e) => setSchedDelay(e.target.value)}
                      />
                      <span className={styles.delaySuffix}>сек</span>
                    </div>
                  </div>

                  <button
                    className={styles.submitBtn}
                    onClick={handleSchedule}
                    disabled={scheduling || !schedTitle.trim() || !schedBody.trim()}
                  >
                    {scheduling ? 'Планирование...' : 'Запланировать'}
                  </button>

                  {schedSuccess && <span className={styles.successMsg}>{schedSuccess}</span>}
                </div>

                {reminders.length > 0 && (
                  <div className={styles.remindersList}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>Активные ({reminders.length})</span>
                    </div>
                    {reminders.map((r) => (
                      <div key={r.id} className={styles.reminderItem}>
                        <div className={styles.reminderInfo}>
                          <span className={styles.reminderName}>{r.title}</span>
                          <span className={styles.reminderTime}>{formatFireAt(r.fireAt)}</span>
                        </div>
                        <button
                          className={styles.reminderCancel}
                          onClick={() => handleCancel(r.id)}
                          title="Отменить"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(PushNotifications);
