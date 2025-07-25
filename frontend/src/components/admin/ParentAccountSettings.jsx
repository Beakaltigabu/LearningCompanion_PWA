import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import useAuthStore from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../services/userService';
import useToastStore from '../../store/toastStore';
import { Trash2, Key, User, Edit3, Save, X, Shield } from 'lucide-react';

const ParentAccountSettings = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const { theme } = useThemeStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const isDark = theme === 'dark';

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    onError: (err) => {
      addToast(`${t('settings.failed_to_load_profile')}: ${err.message}`, 'error');
    },
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        username: profileData.username || '',
        email: profileData.email || '',
      });
    }
  }, [profileData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      updateUser(data); // Update auth store
      addToast(t('settings.profile_updated_successfully'), 'success');
      setIsEditing(false);
    },
    onError: (err) => {
      addToast(`${t('settings.failed_to_update_profile')}: ${err.message}`, 'error');
    },
  });

  const handleSave = async () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      addToast(t('settings.please_fill_required_fields'), 'error');
      return;
    }

    updateProfileMutation.mutate({
      username: formData.username.trim(),
      email: formData.email.trim(),
    });
  };

  const handleCancel = () => {
    setFormData({
      username: profileData?.username || '',
      email: profileData?.email || '',
    });
    setIsEditing(false);
  };

  const handlePasskeyManagement = () => {
    // TODO: Implement Passkey management
    addToast(t('settings.passkey_feature_coming_soon'), 'info');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    if (window.confirm(t('settings.delete_account_confirm'))) {
      addToast(t('settings.delete_account_feature_coming_soon'), 'info');
    }
  };

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
            {t('settings.loading_profile')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Profile Information Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl ${
          isDark ? 'neuro-dark' : 'neuro-light'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`p-3 rounded-lg ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/20 text-blue-600'
              }`}
            >
              <User className="w-5 h-5" />
            </motion.div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('settings.profile_information')}
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            disabled={updateProfileMutation.isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isEditing
                ? isDark
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-red-500/20 text-red-600 hover:bg-red-500/30'
                : isDark
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? t('common.cancel') : t('common.edit')}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('settings.username')} *
            </label>
            {isEditing ? (
              <motion.input
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border-0 transition-all focus:ring-2 ${
                  isDark
                    ? 'neuro-inset-dark text-white placeholder-gray-400 focus:ring-blue-400/50'
                    : 'neuro-inset-light text-gray-900 placeholder-gray-500 focus:ring-blue-500/50'
                }`}
                placeholder={t('settings.enter_username')}
                required
              />
            ) : (
              <div className={`px-4 py-3 rounded-lg ${
                isDark ? 'bg-gray-800/50 text-gray-200' : 'bg-gray-100/50 text-gray-800'
              }`}>
                {profileData?.username || t('settings.not_set')}
              </div>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('settings.email')} *
            </label>
            {isEditing ? (
              <motion.input
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border-0 transition-all focus:ring-2 ${
                  isDark
                    ? 'neuro-inset-dark text-white placeholder-gray-400 focus:ring-blue-400/50'
                    : 'neuro-inset-light text-gray-900 placeholder-gray-500 focus:ring-blue-500/50'
                }`}
                placeholder={t('settings.enter_email')}
                required
              />
            ) : (
              <div className={`px-4 py-3 rounded-lg ${
                isDark ? 'bg-gray-800/50 text-gray-200' : 'bg-gray-100/50 text-gray-800'
              }`}>
                {profileData?.email || t('settings.not_set')}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isDark
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-green-500/20 text-green-600 hover:bg-green-500/30'
              }`}
            >
              <Save className="w-4 h-4" />
              {updateProfileMutation.isPending ? t('settings.saving') : t('settings.save_changes')}
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Passkey Management Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl ${
          isDark ? 'neuro-dark' : 'neuro-light'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-lg ${
              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/20 text-green-600'
            }`}
          >
            <Key className="w-5 h-5" />
          </motion.div>
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {t('settings.passkey_management')}
          </h3>
        </div>

        <p className={`mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('settings.passkey_description')}
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePasskeyManagement}
          className={`glass-button px-6 py-3 rounded-lg font-medium transition-all ${
            isDark
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
              : 'bg-green-500/20 text-green-600 hover:bg-green-500/30 border border-green-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {t('settings.manage_passkeys')}
          </div>
        </motion.button>
      </motion.div>

      {/* Danger Zone Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-xl border-2 ${
          isDark
            ? 'neuro-dark border-red-500/30'
            : 'neuro-light border-red-500/30'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-3 rounded-lg bg-red-500/20 text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </motion.div>
          <h3 className="text-xl font-semibold text-red-500">
            {t('settings.danger_zone')}
          </h3>
        </div>

        <p className={`mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t('settings.delete_account_warning')}
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeleteAccount}
          className="px-6 py-3 rounded-lg font-medium transition-all bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            {t('settings.delete_account')}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ParentAccountSettings;
