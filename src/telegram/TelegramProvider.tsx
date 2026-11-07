import { useEffect, useState, type PropsWithChildren } from 'react';
import { init, isTMA } from '@telegram-apps/sdk-react';

export function TelegramProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isTMA()) {
      try {
        init();
      } catch (e) {
        console.error('SDK init error:', e);
      }
    }
    // В браузере просто пропускаем мок — не вызываем mockTelegramEnv
    setReady(true);
  }, []);

  if (!ready) {
    return <div style={{ backgroundColor: '#1A1A1D', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FF6B35', fontSize: '20px' }}>Загрузка...</div>;
  }

  return <>{children}</>;
}

