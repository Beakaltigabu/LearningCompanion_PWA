import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { Card } from '../components/common/Card';
import CreateChildModal from '../components/CreateChildModal';
import { Button } from '../components/common/Button';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card variant="neumorphic" className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">{t('Welcome')}, {user?.username}!</h1>
        <p className="text-text-secondary mb-8">{t('This is your parent dashboard.')}</p>
        
        <div className="space-y-4">
          <Link to="/select-child">
            <Button variant="neumorphic" className="w-full">
              {t('Select Child Profile')}
            </Button>
          </Link>

          <Button variant="neumorphic" onClick={() => setIsModalOpen(true)} className="w-full">
            {t('Create Child Profile')}
          </Button>

          <Button variant="neumorphic" onClick={logout} className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/30">
            {t('Logout')}
          </Button>
        </div>
      </Card>

      {isModalOpen && (
        <CreateChildModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
