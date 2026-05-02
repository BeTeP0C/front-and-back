'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './InstallPWA.module.scss';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isSafari, setIsSafari] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detect standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Detect Safari
    const ua = navigator.userAgent;
    const isSaf = /Safari/.test(ua) && !/Chrome/.test(ua) && /Apple/.test(navigator.vendor);
    setIsSafari(isSaf);

    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    const prompt = promptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    promptRef.current = null;
  };

  if (installed || dismissed) return null;

  // Chromium: show install button
  if (deferredPrompt) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.btn} onClick={handleInstall}>
          <span className={styles.icon}>📲</span>
          Установить приложение
        </button>
      </div>
    );
  }

  // Safari: show hint
  if (isSafari) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.safari}>
          <button className={styles.close} onClick={() => setDismissed(true)}>×</button>
          <span className={styles.safariTitle}>Установите TechStore</span>
          <span className={styles.safariHint}>
            Нажмите «Поделиться» → «На экран Домой» для установки приложения
          </span>
        </div>
      </div>
    );
  }

  return null;
}
