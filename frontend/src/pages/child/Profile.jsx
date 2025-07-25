import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ChildProfile = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-text-primary mb-6">
        {t('My Profile')}
      </h1>
      
      <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
        <p className="text-text-secondary">
          {t('Child profile settings will be implemented here')}
        </p>
      </div>
    </motion.div>
  );
};

export default ChildProfile;