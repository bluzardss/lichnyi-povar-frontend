import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onClick,
  active = false,
  icon,
  className = '',
}) => {
  const handleClick = () => {
    onClick?.();
  };

  // Base classes
  const baseClasses = 'inline-flex items-center px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer';

  // Active/inactive classes
  const activeClasses = active
    ? 'bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90'
    : 'bg-[#242428] border border-white/10 text-[#FFFFFF] hover:bg-[#242428]/30';

  return (
    <motion.button
      className={`${baseClasses} ${activeClasses} ${className}`}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </motion.button>
  );
};
