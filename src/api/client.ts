import axios from 'axios';
import { useTelegram } from '../telegram/useTelegram';
import { useMemo } from 'react';

/**
 * Создает экземпляр axios с базовым URL из переменных окружения.
 * Добавляет интерцептор запросов, который вставляет заголовок
 * X-Telegram-Init-Data со значением initData от Telegram WebApp.
 * Этот заголовок используется бэкендом для проверки подписи через HMAC-SHA256.
 */
export const createApiClient = () => {
  const { initData } = useTelegram();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 10000,
    });

    // Интерцептор для добавления initData в заголовки
    instance.interceptors.request.use((config) => {
      if (initData) {
        config.headers['X-Telegram-Init-Data'] = initData;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    // Интерцептор для обработки ответов (опционально)
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Можно централизованно обрабатывать ошибки
        return Promise.reject(error);
      }
    );

    return instance;
  }, [initData]);

  return api;
};

// Хук для использования в компонентах
export const useApi = () => {
  return createApiClient();
};
