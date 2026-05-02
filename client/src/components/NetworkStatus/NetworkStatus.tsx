'use client';

import { useEffect, useState } from 'react';
import styles from './NetworkStatus.module.scss';

export default function NetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <div className={`${styles.bar} ${!online ? styles.visible : ''}`}>
      <span className={styles.icon}>⚠️</span>
      Нет подключения к интернету
    </div>
  );
}
