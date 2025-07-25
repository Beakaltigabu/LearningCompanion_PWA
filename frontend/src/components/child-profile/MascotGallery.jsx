import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getMascots } from '../../services/mascotService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';



const MascotGallery = ({ onSelectMascot, selectedMascotId }) => {
  const { t } = useTranslation();

  const { data: mascots, isLoading, error } = useQuery({
    queryKey: ['mascots'],
    queryFn: getMascots
  });

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">{t('Loading mascots...')}</p>
      </div>
    );
  }
  if (error) return <div className="text-center p-6 text-red-500">{t('Error loading mascots')}: {error.message}</div>;

  return (
    <Card className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-sunshine-text mb-4">{t('Choose Your Mascot')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(mascots?.data || []).map((mascot) => (
          <motion.div
            key={mascot.mascot_id}
            whileHover={{ scale: 1.05 }}
            className={`border-4 rounded-lg cursor-pointer transition-colors ${selectedMascotId === mascot.mascot_id ? 'border-sunshine-primary' : 'border-transparent'
              }`}
            onClick={() => onSelectMascot(mascot.mascot_id)}
          >
            <Card className="text-center p-2">
              <img src={mascot.image_url} alt={mascot.name_en} className="w-full h-auto rounded-md mb-2" />
              <h3 className="font-semibold text-sunshine-text">{mascot.name_en}</h3>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default MascotGallery;
