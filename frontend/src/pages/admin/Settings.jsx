import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Palette, Bell, Shield, Database, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Switch } from '../../components/ui/Switch';
import { Select } from '../../components/ui/Select';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import useToastStore from '../../store/toastStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../services/userService';

const AdminSettings = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const [notifications, setNotifications] = useState({});
  const [aiSettings, setAiSettings] = useState({});

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (profileData) {
      setNotifications(profileData.notification_preferences || {});
      setAiSettings(profileData.ai_settings || {});
    }
  }, [profileData]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      addToast(t('Settings saved successfully!'), 'success');
    },
    onError: (error) => {
      addToast(`${t('Error saving settings')}: ${error.message}`, 'error');
    },
  });

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    addToast(t('Language updated successfully'), 'success');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    addToast(t('Theme updated successfully'), 'success');
  };

    const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

    const handleAiSettingChange = (key, value) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate({ 
      notification_preferences: notifications, 
      ai_settings: aiSettings 
    });
  };

    if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{t('Settings')}</h1>
          <p className="text-text-secondary mt-1">{t('Configure your app preferences')}</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={updateProfileMutation.isPending} size="lg">
          {updateProfileMutation.isPending ? t('Saving...') : t('Save All Settings')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">{t('Appearance')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('Language')}
                </label>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'am', label: 'አማርኛ (Amharic)' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('Theme')}
                </label>
                <Select
                  value={theme}
                  onChange={handleThemeChange}
                  options={[
                    { value: 'light', label: t('Light') },
                    { value: 'dark', label: t('Dark') },
                    { value: 'system', label: t('System') }
                  ]}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">{t('Notifications')}</h2>
              <p className="text-sm text-text-secondary">{t('Manage how you receive alerts.')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Child Activity')}</p>
                  <p className="text-sm text-text-secondary">{t('Get notified about child progress')}</p>
                </div>
                                <Switch id="childActivity" checked={notifications.childActivity || false} onCheckedChange={(val) => handleNotificationChange('childActivity', val)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Habit Reminders')}</p>
                  <p className="text-sm text-text-secondary">{t('Reminders for incomplete habits')}</p>
                </div>
                                <Switch id="habitReminders" checked={notifications.habitReminders || false} onCheckedChange={(val) => handleNotificationChange('habitReminders', val)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Reward Requests')}</p>
                  <p className="text-sm text-text-secondary">{t('New reward redemption requests')}</p>
                </div>
                                <Switch id="rewardRequests" checked={notifications.rewardRequests || false} onCheckedChange={(val) => handleNotificationChange('rewardRequests', val)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Weekly Reports')}</p>
                  <p className="text-sm text-text-secondary">{t('Weekly progress summaries')}</p>
                </div>
                <Switch id="weeklyReports" checked={notifications.weeklyReports || false} onCheckedChange={(val) => handleNotificationChange('weeklyReports', val)} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Child Management Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">{t('Child Profiles')}</h2>
            </div>
            <p className="text-text-secondary mb-4 flex-grow">{t('Add, edit, or remove child profiles, and manage their individual settings.')}</p>
            <Link to="/admin/children">
              <Button className="w-full" userType="parent">{t('Manage Children')}</Button>
            </Link>
          </Card>
        </motion.div>

        {/* AI & Data Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">{t('AI & Data')}</h2>
              <p className="text-sm text-text-secondary">{t('Control AI features and data usage.')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Content Generation')}</p>
                  <p className="text-sm text-text-secondary">{t('AI-generated lessons and activities')}</p>
                </div>
                                <Switch id="contentGeneration" checked={aiSettings.contentGeneration || false} onCheckedChange={(val) => handleAiSettingChange('contentGeneration', val)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Adaptive Learning')}</p>
                  <p className="text-sm text-text-secondary">{t('Personalized difficulty adjustment')}</p>
                </div>
                                <Switch id="adaptiveLearning" checked={aiSettings.adaptiveLearning || false} onCheckedChange={(val) => handleAiSettingChange('adaptiveLearning', val)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{t('Insight Generation')}</p>
                  <p className="text-sm text-text-secondary">{t('AI-powered learning insights')}</p>
                </div>
                                <Switch id="insightGeneration" checked={aiSettings.insightGeneration || false} onCheckedChange={(val) => handleAiSettingChange('insightGeneration', val)} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">{t('Data & Privacy')}</h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                {t('Export Data')}
              </Button>

              <Button variant="outline" className="w-full justify-start">
                {t('Privacy Settings')}
              </Button>

              <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                {t('Delete Account')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button onClick={() => addToast(t('Settings saved successfully'), 'success')}>
          {t('Save All Settings')}
        </Button>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
