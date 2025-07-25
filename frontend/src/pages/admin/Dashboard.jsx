import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { t } = useTranslation('parent');

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-text-primary mb-6">
        {t('navigation.dashboard')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('child_management.title')}
          </h2>
          <p className="text-text-secondary">
            {t('child_management.description')}
          </p>
        </div>

        <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('analytics.title')}
          </h2>
          <p className="text-text-secondary">
            {t('analytics.description')}
          </p>
        </div>

        <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('settings.title')}
          </h2>
          <p className="text-text-secondary">
            {t('settings.description')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
