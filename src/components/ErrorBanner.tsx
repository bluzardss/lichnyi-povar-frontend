import React, { useState, useEffect } from 'react';
import { useTelegram } from '../telegram/useTelegram';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onClose,
}) => {
  const { hapticFeedback } = useTelegram();
  const [visible, setVisible] = useState(true);

  // Auto-hide after 8 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [visible]);

  const handleRetry = () => {
    hapticFeedback?.impactOccurred('light');
    onRetry?.();
  };

  const handleClose = () => {
    hapticFeedback?.impactOccurred('light');
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center px-4 py-3 sm:items-start sm:px-6 sm:py-4"
    >
      <div className="flex w-full items-center justify-between space-x-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm" role="alert">
        <div className="flex-shrink-0">
          <span className="text-xl text-red-600">⚠️</span>
        </div>
        <div className="flex-1 text-sm text-red-700">
          {message}
        </div>
        <div className="flex-shrink-0 space-x-2">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="text-red-600 hover:text-red-800"
            >
              Повторить
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="text-red-600 hover:text-red-800"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
