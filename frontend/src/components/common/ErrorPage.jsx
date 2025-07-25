import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, RefreshCw, Bug, AlertTriangle } from 'lucide-react';
import Button from './Button';

const ErrorPage = ({ error, errorInfo, resetError, type = 'general' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate('/');
    if (resetError) resetError();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const errorConfig = {
    general: {
      title: t('Oops! Something went wrong'),
      message: t('We encountered an unexpected error. Please try again or go back home.'),
      emoji: '😵',
      showReload: true
    },
    network: {
      title: t('Connection Problem'),
      message: t('Unable to connect to our servers. Please check your internet connection.'),
      emoji: '📡',
      showReload: true
    },
    notFound: {
      title: t('Page Not Found'),
      message: t('The page you are looking for does not exist.'),
      emoji: '🔍',
      showReload: false
    },
    permission: {
      title: t('Access Denied'),
      message: t('You do not have permission to access this page.'),
      emoji: '🔒',
      showReload: false
    }
  };

  const config = errorConfig[type] || errorConfig.general;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-moon-primary/10 to-sunshine-primary/10 p-4">
      <motion.div
        className="w-full max-w-md p-8 glass glass-light dark:glass-dark rounded-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mascot/Emoji Animation */}
        <motion.div
          className="text-8xl mb-6"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          {config.emoji}
        </motion.div>

        <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text mb-2">
          {config.title}
        </h1>
        
        <p className="text-admin-light-text/70 dark:text-admin-dark-text/70 mb-6">
          {config.message}
        </p>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && error && (
          <motion.details
            className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-left mb-6 border border-red-200 dark:border-red-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <summary className="cursor-pointer text-sm font-semibold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
              <Bug className="w-4 h-4" />
              Error Details (Dev Mode)
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong className="text-xs">Message:</strong>
                <pre className="text-xs text-red-600 dark:text-red-400 mt-1 whitespace-pre-wrap">
                  {error.message}
                </pre>
              </div>
              {error.stack && (
                <div>
                  <strong className="text-xs">Stack:</strong>
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-1 overflow-auto max-h-32 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong className="text-xs">Component Stack:</strong>
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-1 overflow-auto max-h-32 whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </motion.details>
        )}

        <div className="space-y-3">
          {config.showReload && (
            <Button
              onClick={handleReload}
              variant="neumorphic"
              className="w-full bg-gradient-to-r from-moon-primary to-sunshine-primary hover:from-moon-primary/90 hover:to-sunshine-primary/90 text-white font-semibold py-3 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('Try Again')}
            </Button>
          )}
          
          <Button
            onClick={handleGoHome}
            variant="neumorphic"
            className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-admin-light-text dark:text-admin-dark-text hover:bg-white/30 py-3 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('Go Home')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;