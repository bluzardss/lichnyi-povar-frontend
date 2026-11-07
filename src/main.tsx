// Подключаем eruda для отладки в Telegram
if (typeof window !== 'undefined') {
  import('eruda').then((eruda) => eruda.default.init());
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TelegramProvider } from './telegram/TelegramProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </React.StrictMode>,
);
