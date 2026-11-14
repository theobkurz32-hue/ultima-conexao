import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { usePhoneStore } from '../core/store';

export function usePWA() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [pwaError, setPwaError] = useState('');
  const update = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    update.current = registerSW({ onNeedRefresh: () => setUpdateAvailable(true), onOfflineReady: () => setOfflineReady(true), onRegisterError: () => setPwaError('O cache offline não pôde ser instalado neste navegador.') });
  }, []);
  return { updateAvailable, offlineReady, pwaError, applyUpdate: async () => { await usePhoneStore.getState().flushSave(); if (!usePhoneStore.getState().storageError) await update.current?.(true); } };
}
