import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({
  children,
  className = '',
  hover = true,
  glassmorphic = false,
  ...props
}) => {
  const baseClasses = glassmorphic
    ? 'rounded-xl shadow-md bg-white/50 backdrop-blur-md border border-white/20'
    : 'rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';

  return (
    <motion.div
      className={cn(baseClasses, className)}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { Card };
export default Card;
