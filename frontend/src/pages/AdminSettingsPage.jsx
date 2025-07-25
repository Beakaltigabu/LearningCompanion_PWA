import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { Settings, User, Users, Globe, Bell } from 'lucide-react';
import ParentAccountSettings from '../components/admin/ParentAccountSettings';
import ChildManagementList from '../components/admin/ChildManagementList';
import GlobalAppSettings from '../components/admin/GlobalAppSettings';
import { useThemeStore } from '../store/themeStore';

const TABS = [
  { value: 'account', label: 'settings.my_account', icon: User },
  { value: 'children', label: 'settings.child_management', icon: Users },
  { value: 'global', label: 'settings.global_settings', icon: Globe },
  { value: 'notifications', label: 'settings.notifications', icon: Bell },
];

const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('account');
  const isDark = theme === 'dark';

  const tabVariants = {
    inactive: { scale: 1, y: 0 },
    active: { scale: 1.02, y: -2 },
    hover: { scale: 1.05, y: -1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-xl ${
                isDark
                  ? 'neuro-dark text-gray-300'
                  : 'neuro-light text-gray-600'
              }`}
            >
              <Settings className="w-6 h-6" />
            </motion.div>
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('settings.title')}
            </h1>
          </div>
          <p className={`text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('settings.description')}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-2 rounded-2xl ${
            isDark
              ? 'glass-dark border border-gray-700/50'
              : 'glass-light border border-white/50'
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;

              return (
                <motion.button
                  key={tab.value}
                  variants={tabVariants}
                  initial="inactive"
                  animate={isActive ? "active" : "inactive"}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium
                    transition-all duration-300 min-w-[140px] justify-center sm:justify-start
                    ${isActive
                      ? isDark
                        ? 'neuro-dark text-blue-400 shadow-lg'
                        : 'neuro-light text-blue-600 shadow-lg'
                      : isDark
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:block">{t(tab.label)}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl border-2 ${
                        isDark ? 'border-blue-400/30' : 'border-blue-500/30'
                      }`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`rounded-2xl overflow-hidden ${
              isDark
                ? 'glass-dark border border-gray-700/50'
                : 'glass-light border border-white/50'
            }`}
          >
            {activeTab === 'account' && <ParentAccountSettings />}
            {activeTab === 'children' && <ChildManagementList />}
            {activeTab === 'global' && <GlobalAppSettings />}
            {activeTab === 'notifications' && (
              <div className="p-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    className={`inline-flex p-4 rounded-full mb-4 ${
                      isDark ? 'neuro-dark' : 'neuro-light'
                    }`}
                  >
                    <Bell className={`w-8 h-8 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </motion.div>
                  <h2 className={`text-2xl font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('settings.notification_preferences')}
                  </h2>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {t('settings.notification_coming_soon')}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
