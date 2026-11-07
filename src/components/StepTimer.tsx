import React, { useState, useEffect, useRef } from 'react';
import { useTelegram } from '../telegram/useTelegram';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface Step {
  номер: number;
  текст: string;
  длительность_секунд: number;
  подсказка?: string;
}

interface StepTimerProps {
  step: Step;
  isActive?: boolean;
  onComplete?: () => void;
}

export const StepTimer: React.FC<StepTimerProps> = ({
  step,
  isActive = false,
  onComplete,
}) => {
  const { hapticFeedback } = useTelegram();
  const [timeLeft, setTimeLeft] = useState<number>(step.длительность_секунд);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timeLeft when step changes
  useEffect(() => {
    setTimeLeft(step.длительность_секунд);
  }, [step.длительность_секунд]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
          setIsRunning(false);
          hapticFeedback?.notificationOccurred('success');
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    };
  }, [isRunning, timeLeft, hapticFeedback, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleToggle = () => {
    hapticFeedback?.impactOccurred('light');
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    hapticFeedback?.impactOccurred('light');
    if (timerRef.current) {
      clearInterval(timerRef.current as NodeJS.Timeout);
      timerRef.current = null;
    }
    setIsRunning(false);
    setTimeLeft(step.длительность_секунд);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-4 border border-surface/20"
    >
      <div className="flex items-start space-x-3">
        {/* Step number in a circle */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary text-lg font-medium"
        >
          {step.номер}
        </motion.div>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-text">{step.текст}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="ml-2"
            >
              {isRunning ? 'Пауза' : 'Запустить'}
            </Button>
          </div>

          {step.подсказка && (
            <p className="text-text-xs text-text-muted italic">{step.подсказка}</p>
          )}

          {/* Timer display */}
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-mono font-bold ${
              timeLeft <= 10 ? 'text-[#E63946]' : 'text-text'
            }`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-text-xs">осталось</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface/30 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className={`bg-primary h-2.5 transition-all duration-0.1e`}
              style={{
                width: `${((step.длительность_секунд - timeLeft) / step.длительность_секунд) * 100}%`,
              }}
            ></div>
          </div>

          {/* Reset button if timer is not running */}
          {!isRunning && timeLeft > 0 && timeLeft < step.длительность_секунд && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="mt-2"
            >
              Сбросить
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
