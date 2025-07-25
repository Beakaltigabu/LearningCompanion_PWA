import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Button } from '../components/common/Button';
import { useTranslation } from '../hooks/useTranslation';
import { useThemeStore } from '../store/themeStore';

const ChildSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { setUserType, initializeTheme } = useThemeStore();

  useEffect(() => {
    // Set user type to child for child selection
    setUserType('child');
    initializeTheme();
  }, [setUserType, initializeTheme]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        console.log('Fetching children for selection...');
        const data = await api.getChildrenForSelection();
        console.log('API response:', data);
        setChildren(data.children || []);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError('Failed to load child profiles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleSelectChild = (child) => {
    navigate(`/pin-entry/${child.id}`, { state: { childName: child.name } });
  };

  const handleBackToRoleSelection = () => {
    localStorage.removeItem('selectedRole');
    navigate('/role-selection');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sunshine-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sunshine-primary mx-auto mb-4"></div>
          <p className="text-sunshine-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunshine-bg to-sunshine-surface p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Button
            variant="outline"
            onClick={handleBackToRoleSelection}
            className="flex items-center gap-2 border-sunshine-border hover:bg-sunshine-surface"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-sunshine-text mb-2">
              {t('child_selection.select_your_profile')}
            </h1>
            <p className="text-sunshine-text-secondary">
              {t('child_selection.choose_profile_to_continue')}
            </p>
          </div>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t('common.try_again')}
            </Button>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center">
            <UserCircle className="w-24 h-24 text-sunshine-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sunshine-text mb-2">
              {t('child_selection.no_profiles_found')}
            </h3>
            <p className="text-sunshine-text-secondary mb-6">
              {t('child_selection.ask_parent_to_create_profile')}
            </p>
            <Button onClick={handleBackToRoleSelection}>
              {t('child_selection.back_to_role_selection')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectChild(child)}
                className="bg-white rounded-child p-8 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-sunshine-primary"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-sunshine-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-sunshine-text mb-2">
                    {child.name}
                  </h3>
                  {(child.age || child.grade_level) && (
                    <p className="text-sunshine-text-secondary text-sm">
                      {child.age && `${t('profile.age')}: ${child.age}`}
                      {child.age && child.grade_level && ' • '}
                      {child.grade_level && `${t('profile.grade')}: ${child.grade_level}`}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildSelection;
