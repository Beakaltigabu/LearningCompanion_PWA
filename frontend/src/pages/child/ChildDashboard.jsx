import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, Trophy, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../utils/cn';

const ChildDashboard = () => {
  const { t } = useTranslation('child');
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const isMoonTheme = theme === 'moon';

  const dashboardCards = [
    {
      title: t('navigation.learn'),
      description: t('dashboard.continue_your_lessons'),
      icon: BookOpen,
      gradient: isMoonTheme ? 'from-moon-primary to-moon-secondary' : 'from-blue-400 to-blue-600',
      path: '/child/learning'
    },
    {
      title: t('navigation.rewards'),
      description: t('dashboard.see_your_achievements'),
      icon: Trophy,
      gradient: isMoonTheme ? 'from-moon-accent to-moon-secondary' : 'from-yellow-400 to-orange-500',
      path: '/child/rewards'
    },
    {
      title: t('dashboard.daily_habits'),
      description: t('dashboard.track_daily_habits'),
      icon: Heart,
      gradient: isMoonTheme ? 'from-moon-secondary to-moon-primary' : 'from-green-400 to-emerald-500',
      path: '/child/habits'
    },
    {
      title: t('navigation.profile'),
      description: t('dashboard.customize_your_profile'),
      icon: Star,
      gradient: isMoonTheme ? 'from-moon-primary to-moon-accent' : 'from-purple-400 to-pink-500',
      path: '/child/profile'
    }
  ];

  return (
    <div className={cn(
      'min-h-screen p-6 transition-all duration-500',
      isMoonTheme
        ? 'bg-gradient-to-br from-moon-bg to-moon-surface'
        : 'bg-gradient-to-br from-sunshine-bg to-sunshine-surface'
    )}>
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className={cn(
              'w-8 h-8',
              isMoonTheme ? 'text-moon-accent' : 'text-sunshine-primary'
            )} />
            <h1 className={cn(
              'text-4xl font-bold',
              isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
            )}>
              {t('dashboard.welcome_back', { name: user?.username || t('common.friend') })}
            </h1>
            <Sparkles className={cn(
              'w-8 h-8',
              isMoonTheme ? 'text-moon-accent' : 'text-sunshine-primary'
            )} />
          </div>
          <p className={cn(
            'text-lg font-medium',
            isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary'
          )}>
            {t('dashboard.ready_to_learn_today')}
          </p>
        </motion.div>

        {/* Points Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-child-xl p-8 shadow-xl mb-8 text-center backdrop-blur-lg border transition-all duration-300',
            isMoonTheme
              ? 'bg-moon-surface/80 border-moon-border/50'
              : 'bg-sunshine-surface/80 border-sunshine-border/50'
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className={cn(
              'w-10 h-10',
              isMoonTheme ? 'text-moon-accent' : 'text-sunshine-primary'
            )} />
            <span className={cn(
              'text-4xl font-bold',
              isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
            )}>
              1,250
            </span>
            <span className={cn(
              'text-xl font-medium',
              isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary'
            )}>
              {t('dashboard.points')}
            </span>
          </div>
          <p className={cn(
            'text-lg',
            isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary'
          )}>
            {t('dashboard.keep_learning_to_earn_more')}
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.path)}
              className={cn(
                'p-6 cursor-pointer rounded-child-xl shadow-xl backdrop-blur-lg border transition-all duration-300',
                'hover:shadow-2xl',
                isMoonTheme
                  ? 'bg-moon-surface/80 border-moon-border/50 hover:border-moon-primary/50'
                  : 'bg-sunshine-surface/80 border-sunshine-border/50 hover:border-sunshine-primary/50'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'p-4 rounded-child-lg bg-gradient-to-br shadow-lg',
                  card.gradient
                )}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    'text-xl font-bold mb-2',
                    isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
                  )}>
                    {card.title}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    isMoonTheme ? 'text-moon-text-secondary' : 'text-sunshine-text-secondary'
                  )}>
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'rounded-child-xl p-6 shadow-xl backdrop-blur-lg border',
            isMoonTheme
              ? 'bg-moon-surface/80 border-moon-border/50'
              : 'bg-sunshine-surface/80 border-sunshine-border/50'
          )}
        >
          <h2 className={cn(
            'text-2xl font-bold mb-4',
            isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
          )}>
            {t('dashboard.todays_missions')}
          </h2>
          <div className="space-y-3">
            <div className={cn(
              'p-3 rounded-child-lg border',
              isMoonTheme ? 'bg-moon-bg/50 border-moon-border/30' : 'bg-sunshine-bg/50 border-sunshine-border/30'
            )}>
              <p className={cn(
                'font-medium',
                isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
              )}>
                {t('dashboard.complete_math_lesson')}
              </p>
            </div>
            <div className={cn(
              'p-3 rounded-child-lg border',
              isMoonTheme ? 'bg-moon-bg/50 border-moon-border/30' : 'bg-sunshine-bg/50 border-sunshine-border/30'
            )}>
              <p className={cn(
                'font-medium',
                isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
              )}>
                {t('dashboard.read_for_20_minutes')}
              </p>
            </div>
            <div className={cn(
              'p-3 rounded-child-lg border',
              isMoonTheme ? 'bg-moon-bg/50 border-moon-border/30' : 'bg-sunshine-bg/50 border-sunshine-border/30'
            )}>
              <p className={cn(
                'font-medium',
                isMoonTheme ? 'text-moon-text' : 'text-sunshine-text'
              )}>
                {t('dashboard.practice_writing')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChildDashboard;
