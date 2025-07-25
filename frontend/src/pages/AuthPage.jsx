import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './Login';
import Register from './Register';
import { Card } from '../components/common/Card';
import { ThemeToggle } from '../components/common/ThemeToggle';

const AuthPage = () => {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card variant="neumorphic" className="w-full max-w-md">
        {showLogin ? <Login /> : <Register />}
        <button 
          onClick={() => setShowLogin(!showLogin)}
          className="mt-6 text-sm text-link hover:underline w-full text-center"
        >
          {showLogin ? t('Need an account? Register') : t('Already have an account? Login')}
        </button>
      </Card>
    </div>
  );
};

export default AuthPage;
