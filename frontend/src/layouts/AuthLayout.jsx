import React, { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useThemeStore } from '../store/themeStore';

const AuthLayout = memo(() => {
  const { theme, setUserType, initializeTheme } = useThemeStore();

  useEffect(() => {
    // Set user type to parent for auth pages
    setUserType('parent');
    initializeTheme();
  }, [setUserType, initializeTheme]);

  // Use theme-aware classes
  const isDarkTheme = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      isDarkTheme
        ? 'bg-admin-dark-bg text-admin-dark-text'
        : 'bg-admin-light-bg text-admin-light-text'
    }`}>
      {/* Header with controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <LanguageToggle userType="parent" />
        <ThemeToggle userType="parent" />
      </div>

      {/* Main content */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm transition-colors duration-300 ${
          isDarkTheme
            ? 'bg-admin-dark-surface border border-admin-dark-border'
            : 'bg-admin-light-surface border border-admin-light-border'
        }`}>
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
});

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;
