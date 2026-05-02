'use client';

import { useEffect } from 'react';

export default function ServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          console.log('[SW] Registered, scope:', reg.scope);
          reg.update();
        })
        .catch((err) => console.error('[SW] Registration failed:', err));
    }
  }, []);

  return null;
}
