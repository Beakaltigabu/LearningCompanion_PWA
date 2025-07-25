import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Delete } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageToggle } from '../components/common/LanguageToggle';
import * as api from '../services/api';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { useTranslation } from '../hooks/useTranslation';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../utils/cn';

const PinEntry = () => {
  const { childId } = useParams();
  const { t } = useTranslation();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [childName, setChildName] = useState('');
  const [showPin, setShowPin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { childLogin } = useAuthStore();
  const { addToast } = useToastStore();
  const { theme, setUserType, initializeTheme } = useThemeStore();
  const inputRefs = useRef([]);

  const isMoonTheme = theme === 'moon';

  useEffect(() => {
    // Set user type to child for PIN entry
    setUserType('child');
    initializeTheme();
  }, [setUserType, initializeTheme]);

  useEffect(() => {
    const fetchChildName = async () => {
      try {
        const child = await api.getChild(childId);
        setChildName(child.name);
      } catch (error) {
        console.error('Failed to fetch child name:', error);
      }
    };

    if (childId) {
      fetchChildName();
    }
  }, [childId]);

  const handleNumberClick = (number) => {
    const currentIndex = pin.findIndex(digit => digit === '');
    if (currentIndex !== -1) {
      const newPin = [...pin];
      newPin[currentIndex] = number.toString();
      setPin(newPin);
      setError('');

      // Auto-submit when all 4 digits are entered
      if (currentIndex === 3) {
        setTimeout(() => handleSubmit(newPin.join('')), 100);
      }
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = pin.map((digit, index) => digit !== '' ? index : -1)
      .filter(index => index !== -1)
      .pop();

    if (lastFilledIndex !== undefined) {
      const newPin = [...pin];
      newPin[lastFilledIndex] = '';
      setPin(newPin);
      setError('');
    }
  };

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (newPin.every(digit => digit !== '') && index === 3) {
      handleSubmit(newPin.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (pinValue = pin.join('')) => {
    if (pinValue.length !== 4) {
      setError(t('pin_entry.enter_4_digit_pin'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting child login with PIN for child:', childId);

      const result = await api.loginChild(childId, pinValue);
      console.log('Child login result:', result);

      if (result.success) {
        childLogin(result);
        addToast(t('pin_entry.welcome_back_user', { username: result.user.username }), 'success');
        navigate('/child');
      } else {
        throw new Error(t('pin_entry.incorrect_pin'));
      }
    } catch (err) {
      console.error('PIN login failed:', err);
      let errorMessage = t('pin_entry.incorrect_pin');

      if (err.message.includes('not found')) {
        errorMessage = t('pin_entry.user_not_found');
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setPin(['', '', '', '']);
      setIsLoading(false);
      inputRefs.current[0]?.focus();
    }
  };

  const handleBackToSelection = () => {
    navigate('/auth/child-selection');
  };

  const NumberButton = ({ number, delay = 0 }) => (
    <motion.button
      onClick={() => handleNumberClick(number)}
      disabled={isLoading}
      className={cn(
        "w-16 h-16 sm:w-20 sm:h-20 rounded-child text-xl sm:text-2xl font-bold",
        "transition-all duration-200 transform-gpu",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isMoonTheme
          ? [
              "neuro-dark text-moon-text",
              "border-2 border-moon-border/30",
              "hover:border-moon-primary/50 hover:shadow-lg hover:shadow-moon-primary/20",
              "active:scale-95 active:shadow-inner"
            ]
          : [
              "neuro-light text-sunshine-text",
              "border-2 border-sunshine-border/30",
              "hover:border-sunshine-primary/50 hover:shadow-lg hover:shadow-sunshine-primary/20",
              "active:scale-95 active:shadow-inner"
            ]
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {number}
    </motion.button>
  );

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6 transition-all duration-300",
      isMoonTheme
        ? "bg-gradient-to-br from-moon-bg via-moon-surface to-moon-bg"
        : "bg-gradient-to-br from-sunshine-bg via-sunshine-surface to-sunshine-bg"
    )}>
      {/* Header with controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-2 sm:gap-3">
        <LanguageToggle userType="child" />
        <ThemeToggle userType="child" />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={cn(
          "p-6 sm:p-8 rounded-child shadow-2xl border-2 transition-all duration-300",
          "glass glass-light dark:glass-dark",
          isMoonTheme
            ? "bg-moon-surface/80 border-moon-border backdrop-blur-lg"
            : "bg-sunshine-surface/80 border-sunshine-border backdrop-blur-lg"
        )}>
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className={cn(
              "mb-6 p-2 transition-all duration-200",
              isMoonTheme
                ? "hover:bg-moon-primary/20 text-moon-text"
                : "hover:bg-sunshine-primary/20 text-sunshine-text"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={cn(
              "text-2xl sm:text-3xl font-bold mb-2",
              isMoonTheme ? "text-moon-text" : "text-sunshine-text"
            )}>
              {t('pin_entry.enter_your_pin')}
            </h1>
            <p className={cn(
              "text-sm sm:text-base",
              isMoonTheme ? "text-moon-text-secondary" : "text-sunshine-text-secondary"
            )}>
              {t('pin_entry.enter_4_digit_pin')}
            </p>
            {childName && (
              <p className={cn(
                "font-medium mt-2",
                isMoonTheme ? "text-moon-primary" : "text-sunshine-primary"
              )}>
                {t('dashboard.welcome_back', { name: childName })}
              </p>
            )}
          </div>

          {/* PIN Display */}
          <div className="space-y-6">
            <div className="flex justify-center gap-3 sm:gap-4">
              {pin.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type={showPin ? 'text' : 'password'}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl font-bold",
                    "rounded-child transition-all duration-300 focus:outline-none",
                    "transform-gpu",
                    isMoonTheme
                      ? [
                          "neuro-dark text-moon-text",
                          "border-2 border-moon-border/50",
                          "focus:border-moon-primary focus:shadow-lg focus:shadow-moon-primary/25",
                          "hover:shadow-md hover:shadow-moon-accent/20"
                        ]
                      : [
                          "neuro-light text-sunshine-text",
                          "border-2 border-sunshine-border/50",
                          "focus:border-sunshine-primary focus:shadow-lg focus:shadow-sunshine-primary/25",
                          "hover:shadow-md hover:shadow-sunshine-accent/20"
                        ]
                  )}
                  maxLength={1}
                  disabled={isLoading}
                  whileFocus={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>

            {/* Number Dialer */}
            <div className="space-y-4">
              {/* Numbers 1-3 */}
              <div className="flex justify-center gap-4">
                <NumberButton number={1} delay={0.1} />
                <NumberButton number={2} delay={0.15} />
                <NumberButton number={3} delay={0.2} />
              </div>

              {/* Numbers 4-6 */}
              <div className="flex justify-center gap-4">
                <NumberButton number={4} delay={0.25} />
                <NumberButton number={5} delay={0.3} />
                <NumberButton number={6} delay={0.35} />
              </div>

              {/* Numbers 7-9 */}
              <div className="flex justify-center gap-4">
                <NumberButton number={7} delay={0.4} />
                <NumberButton number={8} delay={0.45} />
                <NumberButton number={9} delay={0.5} />
              </div>

              {/* Bottom row: Show/Hide, 0, Backspace */}
              <div className="flex justify-center gap-4 items-center">
                {/* Show/Hide PIN toggle */}
                <motion.button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  disabled={isLoading}
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-child transition-all duration-200",
                    "flex items-center justify-center",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isMoonTheme
                      ? [
                          "neuro-dark text-moon-text-secondary",
                          "border-2 border-moon-border/30",
                          "hover:border-moon-primary/50 hover:text-moon-primary hover:shadow-lg hover:shadow-moon-primary/20"
                        ]
                      : [
                          "neuro-light text-sunshine-text-secondary",
                          "border-2 border-sunshine-border/30",
                          "hover:border-sunshine-primary/50 hover:text-sunshine-primary hover:shadow-lg hover:shadow-sunshine-primary/20"
                        ]
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.3 }}
                  title={showPin ? t('pin_entry.hide_pin') : t('pin_entry.show_pin')}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>

                {/* Number 0 */}
                <NumberButton number={0} delay={0.6} />

                {/* Backspace */}
                <motion.button
                  onClick={handleBackspace}
                  disabled={isLoading || pin.every(digit => digit === '')}
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-child transition-all duration-200",
                    "flex items-center justify-center",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isMoonTheme
                      ? [
                          "neuro-dark text-moon-text-secondary",
                          "border-2 border-moon-border/30",
                          "hover:border-red-400/50 hover:text-red-400 hover:shadow-lg hover:shadow-red-400/20"
                        ]
                      : [
                          "neuro-light text-sunshine-text-secondary",
                          "border-2 border-sunshine-border/30",
                          "hover:border-red-500/50 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/20"
                        ]
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.3 }}
                  title={t('common.delete')}
                >
                  <Delete className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className={cn(
                  "text-sm font-medium px-3 py-2 rounded-child",
                  isMoonTheme
                    ? "text-red-400 bg-red-500/10 border border-red-500/20"
                    : "text-red-600 bg-red-50 border border-red-200"
                )}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit button */}
            <Button
              onClick={() => handleSubmit()}
              disabled={pin.some(digit => !digit) || isLoading}
              className={cn(
                "w-full font-bold py-3 rounded-child transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "glass-button",
                isMoonTheme
                  ? "bg-moon-primary hover:bg-moon-primary/90 text-moon-text shadow-lg shadow-moon-primary/25"
                  : "bg-sunshine-primary hover:bg-sunshine-primary/90 text-white shadow-lg shadow-sunshine-primary/25"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className={cn(
                    "animate-spin rounded-full h-4 w-4 border-b-2",
                    isMoonTheme ? "border-moon-text" : "border-white"
                  )}></div>
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                t('pin_entry.enter_your_pin')
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PinEntry;
