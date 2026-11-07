import { useEffect, useState, type PropsWithChildren } from 'react';
import { init, isTMA, mockTelegramEnv } from '@telegram-apps/sdk-react';

export function TelegramProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Если мы внутри Telegram — инициализируем SDK
    if (isTMA()) {
      try {
        init();
      } catch (e) {
        console.error('SDK init error:', e);
      }
    } else {
      // 2. Если мы в Safari (браузере) — подсовываем фейковое окружение
      try {
        mockTelegramEnv({
          launchParams: {
            tgWebAppData: new URLSearchParams({
              user: JSON.stringify({ id: 1, first_name: 'Гость' }),
              hash: 'mock',
            }),
          },
        });
      } catch (e) {
        console.warn('Mock environment failed:', e);
      }
    }
    setReady(true);
  }, []);

  // Показываем экран загрузки вместо null, чтобы видеть, что React работает
  if (!ready) {
    return <div style={{ backgroundColor: '#1A1A1D', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FF6B35', fontSize: '20px' }}>Загрузка...</div>;
  }

  return <>{children}</>;
}

