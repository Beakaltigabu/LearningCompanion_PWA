import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '../utils/cn';

const ChildAvatar = ({
  name,
  mascotId,
  size = 'md',
  onClick,
  className
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mascot colors based on mascotId (this could be expanded with actual mascot data)
  const getMascotGradient = (mascotId) => {
    const gradients = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-pink-400 to-red-500',
      'from-yellow-400 to-orange-500',
      'from-purple-400 to-pink-500',
      'from-indigo-400 to-blue-500'
    ];

    if (!mascotId) return gradients[0];
    return gradients[mascotId % gradients.length];
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      className={cn(
        sizeClasses[size],
        'rounded-full bg-gradient-to-br shadow-lg',
        'flex items-center justify-center text-white font-bold',
        'border-2 border-white/30 dark:border-gray-700/30',
        getMascotGradient(mascotId),
        onClick && 'cursor-pointer hover:shadow-xl transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunshine-primary',
        className
      )}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      aria-label={name ? `${name}'s avatar` : 'Child avatar'}
    >
      {mascotId ? (
        // If mascot is selected, show mascot representation
        // This could be an actual mascot image/emoji in the future
        <span className="text-lg">🦊</span>
      ) : name ? (
        // Show initials if no mascot
        <span className={cn(
          'font-bold',
          size === 'sm' ? 'text-xs' :
          size === 'md' ? 'text-sm' :
          size === 'lg' ? 'text-base' : 'text-lg'
        )}>
          {getInitials(name)}
        </span>
      ) : (
        // Default user icon
        <User className={iconSizes[size]} />
      )}

      {/* Subtle animation ring for active state */}
      {onClick && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </Component>
  );
};

export default ChildAvatar;
