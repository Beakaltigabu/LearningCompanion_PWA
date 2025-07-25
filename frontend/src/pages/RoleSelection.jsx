import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Baby } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useThemeStore } from '../store/themeStore';

const RoleSelection = () => {
  const { t } = useTranslation('parent');
  const navigate = useNavigate();
  const { theme, setUserType, initializeTheme } = useThemeStore();

  useEffect(() => {
    // Set user type to parent for role selection page
    setUserType('parent');
    initializeTheme();
  }, [setUserType, initializeTheme]);

  const handleRoleSelect = (role) => {
    // Store selected role in localStorage
    localStorage.setItem('selectedRole', role);

    // Navigate to appropriate auth page
    if (role === 'parent') {
      navigate('/auth/parent-login');
    } else {
      navigate('/auth/child-selection');
    }
  };

  // Use theme-aware classes
  const isDarkTheme = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      isDarkTheme
        ? 'bg-admin-dark-bg'
        : 'bg-admin-light-bg'
    }`} style={{
      background: isDarkTheme
        ? 'linear-gradient(145deg, #1a1a1a, #2a2a2a)'
        : 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
    }}>
      {/* Header with controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <LanguageToggle userType="parent" />
        <ThemeToggle userType="parent" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
          }`}>
            {t('role_selection.welcome')}
          </h1>
          <p className={`text-lg md:text-xl ${
            isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
          }`}>
            {t('role_selection.choose_your_role')}
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Parent Role */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => handleRoleSelect('parent')}
              className={`p-8 cursor-pointer transition-all duration-300 border-2 hover:shadow-xl ${
                isDarkTheme
                  ? 'bg-admin-dark-surface border-admin-dark-border hover:border-admin-dark-primary'
                  : 'bg-admin-light-surface border-admin-light-border hover:border-admin-light-primary'
              }`}
              style={{
                background: isDarkTheme
                  ? 'linear-gradient(145deg, #2a2a2a, #1e1e1e)'
                  : 'linear-gradient(145deg, #f0f0f0, #cacaca)',
                boxShadow: isDarkTheme
                  ? '20px 20px 60px #1a1a1a, -20px -20px 60px #2e2e2e'
                  : '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
                borderRadius: '20px',
                border: 'none'
              }}
            >
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  isDarkTheme ? 'bg-admin-dark-primary' : 'bg-admin-light-primary'
                }`} style={{
                  background: isDarkTheme
                    ? 'linear-gradient(145deg, #4a5568, #2d3748)'
                    : 'linear-gradient(145deg, #e2e8f0, #cbd5e0)',
                  boxShadow: isDarkTheme
                    ? 'inset 8px 8px 16px #1a202c, inset -8px -8px 16px #4a5568'
                    : 'inset 8px 8px 16px #cbd5e0, inset -8px -8px 16px #f7fafc'
                }}>
                  <UserCheck className={`w-10 h-10 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
                }`}>
                  {t('role_selection.parent')}
                </h3>
                <p className={`${
                  isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
                }`}>
                  {t('role_selection.parent_description')}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Child Role */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => handleRoleSelect('child')}
              className={`p-8 cursor-pointer transition-all duration-300 border-2 hover:shadow-xl ${
                isDarkTheme
                  ? 'bg-admin-dark-surface border-admin-dark-border hover:border-admin-dark-secondary'
                  : 'bg-admin-light-surface border-admin-light-border hover:border-admin-light-secondary'
              }`}
              style={{
                background: isDarkTheme
                  ? 'linear-gradient(145deg, #2a2a2a, #1e1e1e)'
                  : 'linear-gradient(145deg, #f0f0f0, #cacaca)',
                boxShadow: isDarkTheme
                  ? '20px 20px 60px #1a1a1a, -20px -20px 60px #2e2e2e'
                  : '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
                borderRadius: '20px',
                border: 'none'
              }}
            >
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  isDarkTheme ? 'bg-admin-dark-secondary' : 'bg-admin-light-secondary'
                }`} style={{
                  background: isDarkTheme
                    ? 'linear-gradient(145deg, #4a5568, #2d3748)'
                    : 'linear-gradient(145deg, #e2e8f0, #cbd5e0)',
                  boxShadow: isDarkTheme
                    ? 'inset 8px 8px 16px #1a202c, inset -8px -8px 16px #4a5568'
                    : 'inset 8px 8px 16px #cbd5e0, inset -8px -8px 16px #f7fafc'
                }}>
                  <Baby className={`w-10 h-10 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  isDarkTheme ? 'text-admin-dark-text' : 'text-admin-light-text'
                }`}>
                  {t('role_selection.child')}
                </h3>
                <p className={`${
                  isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
                }`}>
                  {t('role_selection.child_description')}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className={`text-sm ${
            isDarkTheme ? 'text-admin-dark-text-secondary' : 'text-admin-light-text-secondary'
          }`}>
            {t('role_selection.footer_text')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
