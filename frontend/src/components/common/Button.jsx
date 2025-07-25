import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({
  variant = 'primary',
  size = 'md',
  userType = 'child',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = userType === 'child' ? 'child-button' : 'admin-button';

  const variantClasses = {
    primary: userType === 'child'
      ? 'bg-sunshine-primary hover:bg-sunshine-secondary text-sunshine-text shadow-child-card'
      : 'bg-admin-light-primary hover:bg-admin-light-primary/90 text-white shadow-admin-card',
    secondary: userType === 'child'
      ? 'bg-sunshine-secondary hover:bg-sunshine-accent text-sunshine-text shadow-child-card'
      : 'bg-admin-light-secondary hover:bg-admin-light-secondary/90 text-white shadow-admin-card',
    accent: userType === 'child'
      ? 'bg-sunshine-accent hover:bg-sunshine-accent/80 text-sunshine-text shadow-child-card'
      : 'bg-admin-light-accent hover:bg-admin-light-accent/90 text-white shadow-admin-card',
    ghost: userType === 'child'
      ? 'bg-transparent hover:bg-sunshine-surface text-sunshine-text border-2 border-sunshine-border'
      : 'bg-transparent hover:bg-admin-light-surface text-admin-light-text border border-admin-light-border',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
    neumorphic: 'neumorphic-button text-current'
  };

  const sizeClasses = {
    sm: userType === 'child' ? 'px-4 py-2 text-child-sm' : 'px-3 py-1.5 text-sm',
    md: userType === 'child' ? 'px-6 py-3 text-child-base' : 'px-4 py-2 text-sm',
    lg: userType === 'child' ? 'px-8 py-4 text-child-lg' : 'px-6 py-3 text-base',
    xl: userType === 'child' ? 'px-10 py-5 text-child-xl' : 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: userType === 'child' ? 1.05 : 1.02 }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'font-medium transition-all duration-300 ease-in-out',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        userType === 'child' ? 'rounded-child focus-visible:ring-sunshine-primary' : 'rounded-lg focus-visible:ring-admin-light-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export { Button };
export default Button;
