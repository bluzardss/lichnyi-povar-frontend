import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления initData в заголовки (если нужно для Telegram)
apiClient.interceptors.request.use((config) => {
  const initData = (window as any).Telegram?.WebApp?.initData;
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
