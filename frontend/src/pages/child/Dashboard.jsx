import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ChildDashboard = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-text-primary mb-6">
        {t('Child Dashboard')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('Daily Missions')}
          </h2>
          <p className="text-text-secondary">
            {t('Complete your daily learning tasks!')}
          </p>
        </div>

        <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('Progress')}
          </h2>
          <p className="text-text-secondary">
            {t('Track your learning journey')}
          </p>
        </div>

        <div className="glass glass-light dark:glass-dark p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('Rewards')}
          </h2>
          <p className="text-text-secondary">
            {t('Earn points and unlock rewards!')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChildDashboard;
