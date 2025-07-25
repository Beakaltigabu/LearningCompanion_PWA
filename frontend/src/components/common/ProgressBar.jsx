import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  userType = 'child',
  size = 'md',
  animated = true,
  color = 'primary'
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: userType === 'child' ? 'h-3' : 'h-2',
    md: userType === 'child' ? 'h-4' : 'h-3',
    lg: userType === 'child' ? 'h-6' : 'h-4'
  };

  const colorClasses = {
    primary: userType === 'child' ? 'bg-sunshine-primary' : 'bg-admin-light-primary',
    secondary: userType === 'child' ? 'bg-sunshine-secondary' : 'bg-admin-light-secondary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={cn(
              'font-medium',
              userType === 'child'
                ? 'text-child-base text-sunshine-text'
                : 'text-sm text-admin-light-text'
            )}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn(
              'font-medium',
              userType === 'child'
                ? 'text-child-sm text-sunshine-text-secondary'
                : 'text-xs text-admin-light-text-secondary'
            )}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={cn(
        'w-full overflow-hidden',
        userType === 'child' ? 'rounded-child bg-sunshine-border' : 'rounded-md bg-admin-light-border',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            colorClasses[color],
            animated && 'animate-pulse-slow'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
