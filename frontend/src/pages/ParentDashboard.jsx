import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getChildren } from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/themeStore';

const ParentDashboard = () => {
  const { t } = useTranslation('parent');
  const { theme } = useThemeStore();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const childrenData = await getChildren();
        setChildren(childrenData);
      } catch (error) {
        console.error('Failed to fetch children:', error);
        toast.error(t('child_management.failed_to_load_children'));
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [t]);

  if (loading) {
    return (
      <div className={`text-center p-8 ${isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'}`}>
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 ${
          isDarkTheme ? 'border-admin-dark-primary' : 'border-admin-light-primary'
        }`}></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${
          isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
        }`}>
          {t('navigation.dashboard')}
        </h1>
        <Link
          to="/admin/children/new"
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isDarkTheme
              ? 'bg-admin-dark-primary hover:bg-admin-dark-primary/80 text-white'
              : 'bg-admin-light-primary hover:bg-admin-light-primary/80 text-white'
          }`}
        >
          {t('child_management.add_child')}
        </Link>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          className={`p-6 rounded-2xl transition-all duration-200 ${
            isDarkTheme
              ? 'bg-admin-dark-surface border border-admin-dark-border'
              : 'bg-admin-light-surface border border-admin-light-border'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
          }`}>
            {t('child_management.title')}
          </h2>
          <p className={`${
            isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
          }`}>
            {t('child_management.description')}
          </p>
        </motion.div>

        <motion.div
          className={`p-6 rounded-2xl transition-all duration-200 ${
            isDarkTheme
              ? 'bg-admin-dark-surface border border-admin-dark-border'
              : 'bg-admin-light-surface border border-admin-light-border'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
          }`}>
            {t('analytics.title')}
          </h2>
          <p className={`${
            isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
          }`}>
            {t('analytics.description')}
          </p>
        </motion.div>

        <motion.div
          className={`p-6 rounded-2xl transition-all duration-200 ${
            isDarkTheme
              ? 'bg-admin-dark-surface border border-admin-dark-border'
              : 'bg-admin-light-surface border border-admin-light-border'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
          }`}>
            {t('settings.title')}
          </h2>
          <p className={`${
            isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
          }`}>
            {t('settings.description')}
          </p>
        </motion.div>
      </div>

      {/* Children Section */}
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${
          isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
        }`}>
          {t('navigation.children')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.length > 0 ? (
            children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg shadow-sm transition-all duration-200 ${
                  isDarkTheme
                    ? 'bg-admin-dark-surface border border-admin-dark-border'
                    : 'bg-admin-light-surface border border-admin-light-border'
                }`}
              >
                <h3 className={`text-lg font-bold ${
                  isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
                }`}>
                  {child.name}
                </h3>
                <p className={`text-sm ${
                  isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
                }`}>
                  {child.age && `${t('profile.age')}: ${child.age}`}
                  {child.age && child.grade_level && ' • '}
                  {child.grade_level && `${t('profile.grade')}: ${child.grade_level}`}
                </p>
                <Link
                  to={`/admin/children/${child.id}/profile`}
                  className={`inline-block mt-2 transition-colors duration-200 ${
                    isDarkTheme
                      ? 'text-admin-dark-primary hover:text-admin-dark-primary/80'
                      : 'text-admin-light-primary hover:text-admin-light-primary/80'
                  }`}
                >
                  {t('common.edit')} {t('profile.name')}
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className={`mb-4 ${
                isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
              }`}>
                {t('child_management.no_children_yet')}
              </p>
              <Link
                to="/admin/children/new"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDarkTheme
                    ? 'bg-admin-dark-secondary hover:bg-admin-dark-secondary/80 text-white'
                    : 'bg-admin-light-secondary hover:bg-admin-light-secondary/80 text-white'
                }`}
              >
                {t('child_management.add_first_child')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ParentDashboard;
