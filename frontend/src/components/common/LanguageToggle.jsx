import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguageStore } from '../../store/languageStore';
import { useTranslation } from 'react-i18next';

export const LanguageToggle = ({ userType = 'parent', className }) => {
  const { language, setLanguage } = useLanguageStore();
  const { i18n } = useTranslation();
  const isAmharic = language === 'am';

  // Sync i18n with store language
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLanguage = isAmharic ? 'en' : 'am';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleToggle}
      type="button"
      className={cn(
        'relative inline-flex items-center gap-2 px-3 py-2',
        'transition-all duration-300 ease-in-out',
        userType === 'child'
          ? 'rounded-child bg-sunshine-surface border-2 border-sunshine-border hover:border-sunshine-primary text-sunshine-text'
          : 'rounded-lg bg-admin-light-surface dark:bg-admin-dark-surface border border-admin-light-border dark:border-admin-dark-border hover:border-admin-light-primary dark:hover:border-admin-dark-primary text-admin-light-text dark:text-admin-dark-text',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        userType === 'child' ? 'focus-visible:ring-sunshine-primary' : 'focus-visible:ring-admin-light-primary dark:focus-visible:ring-admin-dark-primary',
        className
      )}
    >
      <Globe className={cn(
        userType === 'child' ? 'w-5 h-5' : 'w-4 h-4'
      )} />

      <div className="flex items-center gap-1">
        <span className={cn(
          'font-medium transition-opacity duration-200',
          userType === 'child' ? 'text-child-sm' : 'text-xs',
          !isAmharic ? 'opacity-100' : 'opacity-50'
        )}>
          EN
        </span>
        <span className="text-gray-400">|</span>
        <span className={cn(
          'font-medium transition-opacity duration-200',
          userType === 'child' ? 'text-child-sm' : 'text-xs',
          isAmharic ? 'opacity-100' : 'opacity-50'
        )}>
          አማ
        </span>
      </div>

      {/* Active indicator */}
      <motion.div
        className={cn(
          'absolute bottom-0 left-0 h-0.5',
          userType === 'child' ? 'bg-sunshine-primary' : 'bg-admin-light-primary dark:bg-admin-dark-primary'
        )}
        animate={{
          width: '50%',
          x: isAmharic ? '50%' : '0%'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};
