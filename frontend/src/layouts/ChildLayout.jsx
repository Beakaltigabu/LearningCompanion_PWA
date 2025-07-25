import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  Compass,
  MessageCircle,
  Gift,
  User,
  Heart,
  Trophy
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../utils/cn';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageToggle } from '../components/common/LanguageToggle';
import NotificationBell from '../components/NotificationBell';
import ChildAvatar from '../components/ChildAvatar';
import useAuthStore from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const ChildLayout = () => {
  const { t } = useTranslation('child');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, setUserType, initializeTheme } = useThemeStore();

  useEffect(() => {
    // Set user type to child for child pages
    setUserType('child');
    initializeTheme();
  }, [setUserType, initializeTheme]);

  const navItems = [
    {
      path: '/child',
      icon: Home,
      label: t('navigation.home')
    },
    {
      path: '/child/learning',
      icon: BookOpen,
      label: t('navigation.learn')
    },
    {
      path: '/child/habits',
      icon: Heart,
      label: t('navigation.rewards')
    },
    {
      path: '/child/rewards',
      icon: Trophy,
      label: t('navigation.rewards')
    },
    {
      path: '/child/profile',
      icon: User,
      label: t('navigation.profile')
    }
  ];

  // Get current date for header
  const currentDate = new Date().toLocaleDateString(
    user?.language === 'am' ? 'am-ET' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const isMoonTheme = theme === 'moon';

  return (
    <div className={cn(
      'min-h-screen transition-all duration-500',
      isMoonTheme
        ? 'bg-gradient-to-br from-moon-bg to-moon-surface'
        : 'bg-gradient-to-br from-sunshine-bg to-sunshine-surface'
    )}>
      {/* Persistent Header */}
      <header className={cn(
        'backdrop-blur-lg border-b sticky top-0 z-40 transition-all duration-300',
        isMoonTheme
          ? 'bg-moon-surface/80 border-moon-border/30'
          : 'bg-sunshine-surface/80 border-sunshine-border/30'
      )}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Date Display */}
            <div className="text-left">
              <p className={cn(
                'text-xs sm:text-sm font-medium',
                isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary'
              )}>
                {t('dashboard.today')}
              </p>
              <p className={cn(
                'text-sm sm:text-base font-bold',
                isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
              )}>
                {currentDate}
              </p>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-3">
              <NotificationBell
                userType="child"
                count={3}
                className={cn(
                  'p-2 rounded-child transition-all duration-200',
                  isMoonTheme
                    ? 'hover:bg-moon-primary/20 border border-moon-border/50'
                    : 'hover:bg-sunshine-primary/20 border border-sunshine-border/50'
                )}
              />

              <ChildAvatar
                name={user?.username || t('child')}
                mascotId={user?.mascot_id}
                onClick={() => navigate('/child/profile')}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              />

              <ThemeToggle
                userType="child"
                className="transition-all duration-200"
              />

              <LanguageToggle
                userType="child"
                className={cn(
                  'p-2 rounded-child transition-all duration-200',
                  isMoonTheme
                    ? 'hover:bg-moon-primary/20 border border-moon-border/50'
                    : 'hover:bg-sunshine-primary/20 border border-sunshine-border/50'
                )}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-28">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          className={cn(
            'px-6 py-4 rounded-child-xl flex items-center gap-4 shadow-2xl backdrop-blur-lg border transition-all duration-300',
            isMoonTheme
              ? 'bg-moon-surface/90 border-moon-border/30'
              : 'bg-sunshine-surface/90 border-sunshine-border/30'
          )}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-child transition-all duration-200 min-w-[60px]',
                  'hover:scale-105 active:scale-95',
                  isActive && (isMoonTheme
                    ? 'bg-moon-primary/30 shadow-lg border border-moon-primary/50'
                    : 'bg-sunshine-primary/30 shadow-lg border border-sunshine-primary/50')
                )}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon
                  size={22}
                  className={cn(
                    'transition-colors duration-200',
                    isActive
                      ? (isMoonTheme ? 'text-moon-primary' : 'text-sunshine-primary')
                      : (isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary')
                  )}
                />
                <span className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive
                    ? (isMoonTheme ? 'text-moon-primary' : 'text-sunshine-primary')
                    : (isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary')
                )}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </nav>
    </div>
  );
};

export default ChildLayout;
