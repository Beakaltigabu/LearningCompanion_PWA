import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useThemeStore } from '../../store/themeStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../services/userService';
import useToastStore from '../../store/toastStore';
import { Globe, Palette, Brain, Bell, Sun, Moon, Languages, Zap } from 'lucide-react';

const GlobalAppSettings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const [aiSettings, setAiSettings] = useState({
    contentGeneration: true,
    adaptiveLearning: true,
    defaultDifficulty: 'medium',
    masteryThreshold: 80,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    childActivity: true,
    habitReminders: true,
    rewardRequests: true,
    weeklyReports: true,
  });

  const isDark = theme === 'dark';

  // Fetch user profile for settings
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    onError: (err) => {
      addToast(`${t('settings.failed_to_load_settings')}: ${err.message}`, 'error');
    },
  });

  // Update settings when profile loads
  useEffect(() => {
    if (profileData) {
      if (profileData.ai_settings) {
        setAiSettings(prev => ({
          ...prev,
          ...profileData.ai_settings
        }));
      }
      if (profileData.notification_preferences) {
        setNotificationSettings(prev => ({
          ...prev,
          ...profileData.notification_preferences
        }));
      }
    }
  }, [profileData]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      addToast(t('settings.settings_saved_successfully'), 'success');
    },
    onError: (err) => {
      addToast(`${t('settings.failed_to_save_settings')}: ${err.message}`, 'error');
    },
  });

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    // Save language preference to backend
    updateSettingsMutation.mutate({
      language_preference: language
    });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Save theme preference to backend
    updateSettingsMutation.mutate({
      theme_preference: newTheme
    });
  };

  const handleAiSettingChange = (setting, value) => {
    const newAiSettings = { ...aiSettings, [setting]: value };
    setAiSettings(newAiSettings);

    // Auto-save AI settings
    updateSettingsMutation.mutate({
      ai_settings: newAiSettings
    });
  };

  const handleNotificationChange = (setting, value) => {
    const newNotificationSettings = { ...notificationSettings, [setting]: value };
    setNotificationSettings(newNotificationSettings);

    // Auto-save notification settings
    updateSettingsMutation.mutate({
      notification_preferences: newNotificationSettings
    });
  };

  const handleSaveAll = () => {
    updateSettingsMutation.mutate({
      ai_settings: aiSettings,
      notification_preferences: notificationSettings,
      theme_preference: theme,
      language_preference: i18n.language
    });
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className={`text-sm font-medium ${
          isDark ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {label}
        </label>
        <p className={`text-xs mt-1 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
          checked
            ? isDark ? 'bg-blue-500' : 'bg-blue-600'
            : isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}
      >
        <motion.span
          layout
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </motion.button>
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('settings.loading_settings')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Language & Theme Settings */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl ${
          isDark ? 'neuro-dark' : 'neuro-light'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`p-3 rounded-lg ${
              isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/20 text-purple-600'
            }`}
          >
            <Palette className="w-5 h-5" />
          </motion.div>
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t('settings.appearance_language')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Languages className="w-4 h-4" />
              {t('settings.interface_language')}
            </label>
            <div className="space-y-2">
              {[
                { value: 'en', label: t('settings.english'), flag: '🇺🇸' },
                { value: 'am', label: t('settings.amharic'), flag: '🇪🇹' }
              ].map((lang) => (
                <motion.button
                  key={lang.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    i18n.language === lang.value
                      ? isDark
                        ? 'neuro-inset-dark text-blue-400 border border-blue-400/30'
                        : 'neuro-inset-light text-blue-600 border border-blue-500/30'
                      : isDark
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                  {i18n.language === lang.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-current"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Palette className="w-4 h-4" />
              {t('settings.admin_theme')}
            </label>
            <div className="space-y-2">
              {[
                { value: 'light', label: t('settings.light'), icon: Sun },
                { value: 'dark', label: t('settings.dark'), icon: Moon }
              ].map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <motion.button
                    key={themeOption.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      theme === themeOption.value
                        ? isDark
                          ? 'neuro-inset-dark text-blue-400 border border-blue-400/30'
                          : 'neuro-inset-light text-blue-600 border border-blue-500/30'
                        : isDark
                          ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                          : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{themeOption.label}</span>
                    {theme === themeOption.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-current"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Settings */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl ${
          isDark ? 'neuro-dark' : 'neuro-light'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-lg ${
              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/20 text-green-600'
            }`}
          >
            <Brain className="w-5 h-5" />
          </motion.div>
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t('settings.ai_learning_settings')}
          </h3>
        </div>

        <div className="space-y-6">
          <ToggleSwitch
            checked={aiSettings.contentGeneration}
            onChange={(value) => handleAiSettingChange('contentGeneration', value)}
            label={t('settings.ai_content_generation')}
            description={t('settings.ai_content_description')}
          />

          <ToggleSwitch
            checked={aiSettings.adaptiveLearning}
            onChange={(value) => handleAiSettingChange('adaptiveLearning', value)}
            label={t('settings.adaptive_learning')}
            description={t('settings.adaptive_learning_description')}
          />

          <div>
            <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Zap className="w-4 h-4" />
              {t('settings.default_difficulty')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <motion.button
                  key={difficulty}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAiSettingChange('defaultDifficulty', difficulty)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    aiSettings.defaultDifficulty === difficulty
                      ? isDark
                        ? 'neuro-inset-dark text-blue-400 border border-blue-400/30'
                        : 'neuro-inset-light text-blue-600 border border-blue-500/30'
                      : isDark
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                  }`}
                >
                  {t(`settings.${difficulty}`)}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('settings.mastery_threshold')} ({aiSettings.masteryThreshold}%)
            </label>
            <div className={`p-4 rounded-lg ${
              isDark ? 'neuro-inset-dark' : 'neuro-inset-light'
            }`}>
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={aiSettings.masteryThreshold}
                onChange={(e) => handleAiSettingChange('masteryThreshold', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs mt-2">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>60%</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>100%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-xl ${
          isDark ? 'neuro-dark' : 'neuro-light'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`p-3 rounded-lg ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500/20 text-orange-600'
            }`}
          >
            <Bell className="w-5 h-5" />
          </motion.div>
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t('settings.notification_preferences')}
          </h3>
        </div>

        <div className="space-y-6">
          <ToggleSwitch
            checked={notificationSettings.childActivity}
            onChange={(value) => handleNotificationChange('childActivity', value)}
            label={t('settings.child_activity_notifications')}
            description={t('settings.child_activity_description')}
          />

          <ToggleSwitch
            checked={notificationSettings.habitReminders}
            onChange={(value) => handleNotificationChange('habitReminders', value)}
            label={t('settings.habit_reminders')}
            description={t('settings.habit_reminders_description')}
          />

          <ToggleSwitch
            checked={notificationSettings.rewardRequests}
            onChange={(value) => handleNotificationChange('rewardRequests', value)}
            label={t('settings.reward_requests')}
            description={t('settings.reward_requests_description')}
          />

          <ToggleSwitch
            checked={notificationSettings.weeklyReports}
            onChange={(value) => handleNotificationChange('weeklyReports', value)}
            label={t('settings.weekly_reports')}
            description={t('settings.weekly_reports_description')}
          />
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveAll}
          disabled={updateSettingsMutation.isPending}
          className={`glass-button px-8 py-4 rounded-xl font-semibold transition-all ${
            isDark
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/30'
              : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border border-blue-500/30'
          }`}
        >
          {updateSettingsMutation.isPending ? t('settings.saving') : t('settings.save_all_settings')}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GlobalAppSettings;
