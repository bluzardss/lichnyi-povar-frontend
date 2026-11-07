import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ 
  text = 'Повар колдует...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 border-3',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
      className="flex flex-col items-center gap-4 p-8 glass-elevated rounded-2xl"
    >
      {/* Pulsing Ring */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className={`absolute inset-0 border-2 border-accent/20 rounded-full ${'w-full h-full'}`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Middle ring */}
        <motion.div
          className={`absolute inset-4 border-2 border-accent/40 rounded-full`}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        {/* Inner spinning ring */}
        <motion.div
          className={`${sizeClasses[size]} border-accent rounded-full border-t-transparent border-r-accent border-b-accent border-l-accent`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.6, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Text */}
      <motion.p
        className={`text-text-primary font-medium ${textSizeClasses[size]} text-center`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {text}
      </motion.p>

      {/* Subtle particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-accent/60 rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Size classes helper
const sizeClasses = {
  sm: 'w-10 h-10 border-3',
  md: 'w-16 h-16 border-4',
  lg: 'w-24 h-24 border-6',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};
