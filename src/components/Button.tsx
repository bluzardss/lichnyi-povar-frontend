import React from 'react';
import { useTelegram } from '../telegram/useTelegram';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const { hapticFeedback } = useTelegram();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    hapticFeedback?.impactOccurred('light');
    onClick?.(e);
  };

  // Base classes
  const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-button',
    md: 'px-6 py-3 text-base rounded-button',
    lg: 'px-8 py-4 text-lg rounded-button',
  }[size];

  // Full width
  const fullWidthClass = fullWidth ? 'w-full' : '';

  // Variant classes
  const variantClasses = {
    primary: `
      relative overflow-hidden
      bg-gradient-to-r from-accent via-red-500 to-accent-dark
      text-white
      backdrop-blur-glass border border-border-strong
      shadow-red-glow
      before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:opacity-0
      hover:before:opacity-100
      transition-all duration-300
      hover:shadow-red-glow-strong hover:scale-[1.02]
      active:scale-[0.95] active:shadow-red-glow-strong
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-surface-elevated/50 backdrop-blur-glass border border-border-subtle text-white
      transition-all duration-300
      hover:bg-surface-elevated/70 hover:border-border-strong hover:shadow-glass-hover
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-transparent text-accent border border-border-subtle
      transition-all duration-300
      hover:bg-accent/10 hover:border-accent/30
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  }[variant];

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidthClass} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: variant === 'primary' ? 1.02 : 1 }}
    >
      {children}
    </motion.button>
  );
};
