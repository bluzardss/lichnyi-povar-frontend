import { useEffect, useState } from 'react';

// Интерфейсы для Telegram WebApp (частичные, только используемое)
interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface ThemeParams {
  background_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
}

interface MainButton {
  show: () => void;
  hide: () => void;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

interface HapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
}

interface WebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    [key: string]: unknown;
  };
  themeParams: ThemeParams;
  version?: string;
  isThemeSupported?: boolean;
  hapticFeedback: HapticFeedback;
  mainButton: MainButton;
  ready: () => void;
  expand: () => void;
  close: () => void;
}

interface TelegramWindow extends Window {
  Telegram?: {
    WebApp?: WebApp;
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends TelegramWindow {}
}

/**
 * Кастомный хук для работы с Telegram WebApp.
 * Возвращает объект с веб-приложением, данными пользователя, инициализационными данными,
 * хэптик-обратной связью и методом показа основной кнопки.
 */
export const useTelegram = () => {
  const [webApp, setWebApp] = useState<WebApp | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setWebApp(tg);
    }
  }, []);

  // Можно извлечь пользователя из initDataUnsafe или из initData (base64)
  const user = webApp?.initDataUnsafe?.user ?? null;
  const initData = webApp?.initData ?? '';
  const themeParams = webApp?.themeParams ?? {};
  const version = webApp?.version;
  const isThemeSupported = webApp?.isThemeSupported ?? true;
  const hapticFeedback = webApp?.hapticFeedback ?? null;
  const hideMainButton = () => {
    webApp?.mainButton.hide();
  };
  const showMainButton = () => {
    webApp?.mainButton.show();
    webApp?.mainButton.setText('Готово');
  };
  const onMainButtonClick = (callback: () => void) => {
    webApp?.mainButton.onClick(callback);
  };
  const offMainButtonClick = (callback: () => void) => {
    webApp?.mainButton.offClick(callback);
  };

  return {
    webApp,
    initData,
    user,
    themeParams,
    version,
    isThemeSupported,
    hapticFeedback,
    showMainButton,
    hideMainButton,
    onMainButtonClick,
    offMainButtonClick,
  };
};
