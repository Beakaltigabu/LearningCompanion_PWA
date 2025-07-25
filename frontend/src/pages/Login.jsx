import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { startAuthentication } from '@simplewebauthn/browser';
import { motion } from 'framer-motion';
import { Fingerprint, ArrowRight, Info } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import * as api from '../services/api';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();

  // Show success message from registration
  React.useEffect(() => {
    if (location.state?.message) {
      addToast(location.state.message, 'success');
    }
  }, [location.state, addToast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!username.trim()) {
      setError(t('auth.username_required'));
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setError(t('auth.username_too_short'));
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting authentication for username:', username);

      // 1. Get authentication options from the server
      const options = await api.startAuthentication(username);
      console.log('Authentication options received:', options);

      // 2. Start WebAuthn authentication in the browser
      const assertionResponse = await startAuthentication({ optionsJSON: options });
      console.log('WebAuthn authentication completed:', assertionResponse);

      // 3. Finish authentication on the server
      const result = await api.finishAuthentication(username, assertionResponse);
      console.log('Authentication result:', result);

      if (result.verified) {
        // 4. Store tokens and user data
        login(result.user, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        });

        // 5. Redirect based on user role
        addToast(t('auth.welcome_back_user', { username: result.user.username }), 'success');
        navigate(result.user.role === 'parent' ? '/admin' : '/child');
      } else {
        throw new Error(t('auth.authentication_failed'));
      }
    } catch (err) {
      console.error('Login failed:', err);
      let errorMessage = t('auth.authentication_failed');

      if (err.message.includes('not found')) {
        errorMessage = t('auth.user_not_found');
      } else if (err.message.includes('invalid') || err.message.includes('Invalid')) {
        errorMessage = t('auth.invalid_credentials');
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          className="flex justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sunshine-primary to-moon-primary rounded-child-xl flex items-center justify-center">
            <Fingerprint className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {t('auth.welcome_back')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('auth.sign_in_passkey')}
        </p>
      </div>

      {/* Info Box */}
      <motion.div
        className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-child text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-blue-800 dark:text-blue-200">
            {t('auth.passkey_info')}
          </p>
        </div>
      </motion.div>

      {/* Login Form */}
      <motion.form
        onSubmit={handleLogin}
        className="space-y-4 sm:space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div>
          <Input
            type="text"
            placeholder={t('auth.username_placeholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="w-full"
            autoComplete="username"
            autoFocus
          />
        </div>

        {error && (
          <motion.div
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-child text-sm text-red-800 dark:text-red-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="w-full flex items-center justify-center gap-2"
          variant="neumorphic"
        >
          <Fingerprint className="w-4 h-4" />
          {isLoading ? t('auth.signing_in') : t('auth.login_with_passkey')}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </motion.form>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          {t('auth.need_account')}{' '}
          <Link
            to="/auth/register"
            className="text-sunshine-primary hover:text-sunshine-secondary font-medium transition-colors"
          >
            {t('auth.create_one_here')}
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
