import axios from 'axios';

/**
 * Plain axios instance for use in stores (outside React components)
 * Doesn't have the Telegram initData interceptor - that's added in components
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
});