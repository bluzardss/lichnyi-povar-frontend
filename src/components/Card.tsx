import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onClick?: () => void;
  variant?: 'glass' | 'elevated' | 'outlined';
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'glass',
  elevated = false,
  ...props
}) => {
  const handleClick = () => {
    onClick?.();
  };

  const variantClasses = {
    glass: `
      glass rounded-2xl transition-all duration-300
      hover:glass-elevated
    `,
    elevated: `
      glass-elevated rounded-2xl transition-all duration-300
    `,
    outlined: `
      rounded-2xl border border-border-subtle bg-transparent
      backdrop-blur-glass transition-all duration-300
      hover:border-border-strong hover:bg-surface/20
    `,
  }[variant];

  const elevationClass = elevated ? 'glass-elevated' : '';

  return (
    <motion.div
      className={`${variantClasses} ${elevationClass} ${className} rounded-2xl`}
      onClick={handleClick}
      {...props}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      {children}
    </motion.div>
  );
};
