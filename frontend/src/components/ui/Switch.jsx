import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Switch = ({ checked, onChange, disabled = false, className }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <motion.span
        layout
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
        animate={{
          x: checked ? 24 : 4
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      />
    </button>
  );
};
