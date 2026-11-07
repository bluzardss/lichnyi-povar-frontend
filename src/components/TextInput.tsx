import React, { useState, useRef, useEffect } from 'react';
import { useTelegram } from '../telegram/useTelegram';
import { motion } from 'framer-motion';

interface TextInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  onSend, 
  placeholder = 'Опиши, что хочешь приготовить…' 
}) => {
  const { hapticFeedback } = useTelegram();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [text]);

  // Handle key down: Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    hapticFeedback?.impactOccurred('light');
    onSend(trimmed);
    setText('');
    setTimeout(() => resizeTextarea(), 0);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
      className="relative"
    >
      <div className="relative">
        {/* Glow ring behind input */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 blur-2xl"
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 300 }}
        />
        
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            relative w-full min-h-[80px] max-h-[200px]
            rounded-2xl p-5 pr-16
            bg-surface/40 backdrop-blur-glass
            border-2 transition-all duration-300
            text-text placeholder-text-dim
            resize-none focus:outline-none
            ${isFocused ? 'border-accent/50 shadow-red-glow' : 'border-border-subtle hover:border-border-strong'}
          `}
          style={{ 
            resize: 'none', 
            overflow: 'hidden',
            background: 'rgba(36, 36, 40, 0.4)',
          }}
        />
        
        {/* Send button inside input */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`
            absolute right-3 bottom-3
            px-4 py-2.5 rounded-button
            font-semibold text-white
            bg-gradient-to-r from-accent via-red-500 to-accent-dark
            shadow-red-glow backdrop-blur-glass
            border border-border-strong
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};
