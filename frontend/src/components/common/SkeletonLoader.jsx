import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const SkeletonLoader = ({
  variant = 'rectangular',
  width = 'w-full',
  height = 'h-4',
  className = '',
  count = 1,
  spacing = 'space-y-2'
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 animate-pulse';

  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    avatar: 'rounded-full w-10 h-10',
    card: 'rounded-xl h-32'
  };

  const skeletonElement = (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        width,
        height,
        className
      )}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className={cn(spacing)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {skeletonElement}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
