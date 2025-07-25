import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  className = '',
  type = 'text',
  error = false,
  label,
  variant = 'default',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
    neumorphic: 'shadow-inner bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-3 rounded-lg',
          'focus:shadow-md focus:ring-2 focus:ring-blue-300 focus:outline-none',
          'text-gray-900 dark:text-white',
          'transition-all duration-200',
          variantClasses[variant],
          error && 'border-red-500 focus:ring-red-300',
          className
        )}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
