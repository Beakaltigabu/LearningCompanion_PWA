import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { startRegistration } from '@simplewebauthn/browser';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Fingerprint, Info } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import * as api from '../services/api';
import useToastStore from '../store/toastStore';

const Register = () => {
  const { t } = useTranslation();
  const { addToast } = useToastStore();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
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

    if (username.length > 50) {
      setError(t('auth.username_too_long'));
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting registration for username:', username);

      // 1. Get registration options from the server
      const options = await api.startRegistration(username);
      console.log('Registration options received:', options);

      // 2. Start WebAuthn registration in the browser
      const attestationResponse = await startRegistration({ optionsJSON: options });
      console.log('WebAuthn registration completed:', attestationResponse);

      // 3. Finish registration on the server
      const result = await api.finishRegistration(username, attestationResponse);
      console.log('Registration result:', result);

      if (result.verified) {
        addToast(t('auth.account_created_success'), 'success');
        navigate('/auth/login', {
          state: {
            message: t('auth.account_created_signin'),
            username
          }
        });
      } else {
        throw new Error(t('auth.registration_failed'));
      }
    } catch (err) {
      console.error('Registration failed:', err);
      let errorMessage = t('auth.registration_failed');

      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        errorMessage = 'Username already exists. Please choose a different one.';
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
            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {t('auth.create_account')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('auth.create_passkey')}
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

      {/* Registration Form */}
      <motion.form
        onSubmit={handleRegister}
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
          {isLoading ? t('auth.creating_account') : t('auth.register_with_passkey')}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </motion.form>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          {t('auth.already_have_account')}{' '}
          <Link
            to="/auth/login"
            className="text-sunshine-primary hover:text-sunshine-secondary font-medium transition-colors"
          >
            {t('auth.sign_in_here')}
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
