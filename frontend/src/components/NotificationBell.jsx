import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';

const NotificationBell = ({
  count = 0,
  userType = 'child',
  onClick,
  className
}) => {
  const { t } = useTranslation();
  const hasNotifications = count > 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - could navigate to notifications page
      console.log('Notification bell clicked');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center',
        'transition-all duration-200',
        userType === 'child'
          ? 'w-10 h-10 rounded-child bg-sunshine-surface/50 hover:bg-sunshine-surface/70 border border-sunshine-border/30'
          : 'w-8 h-8 rounded-lg bg-surface/50 hover:bg-surface/70 border border-border/30',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        userType === 'child' ? 'focus-visible:ring-sunshine-primary' : 'focus-visible:ring-primary',
        className
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={t('notifications')}
    >
      <Bell
        className={cn(
          userType === 'child' ? 'w-5 h-5' : 'w-4 h-4',
          'text-sunshine-text dark:text-moon-text'
        )}
      />

      {hasNotifications && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1',
            'bg-red-500 text-white text-xs font-bold',
            'rounded-full flex items-center justify-center',
            'shadow-lg border-2 border-white dark:border-gray-800'
          )}
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}

      {hasNotifications && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
};

export default NotificationBell;
