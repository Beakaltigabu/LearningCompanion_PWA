import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import { getChildProfile, updateChildProfile } from '../../services/childService';
import { getMascots } from '../../services/mascotService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import MascotGallery from '../../components/child-profile/MascotGallery';
import { Sparkles } from 'lucide-react';

const ChildProfile = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const [selectedMascotId, setSelectedMascotId] = useState(null);

  const { data: childData, isLoading: isLoadingChild } = useQuery({
    queryKey: ['childProfile', user?.id],
    queryFn: () => getChildProfile(user.id),
    enabled: !!user?.id,
  });

  const { data: mascots, isLoading: isLoadingMascots, error: mascotsError } = useQuery({
    queryKey: ['mascots'],
    queryFn: getMascots,
    onError: (error) => {
      console.error('Error fetching mascots:', error);
      addToast(`${t('Error loading mascots')}: ${error.message}`, 'error');
    },
  });

  useEffect(() => {
    if (childData?.selected_mascot_id) {
      setSelectedMascotId(childData.selected_mascot_id);
    }
  }, [childData]);

  const updateMascotMutation = useMutation({
    mutationFn: (newMascotId) => updateChildProfile(user.id, { selected_mascot_id: newMascotId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfile', user?.id] });
      addToast(t('Mascot updated successfully!'), 'success');
    },
    onError: (error) => {
      addToast(`${t('Error updating mascot')}: ${error.message}`, 'error');
    },
  });

  const handleSave = () => {
    if (selectedMascotId && selectedMascotId !== childData?.selected_mascot_id) {
      updateMascotMutation.mutate(selectedMascotId);
    }
  };

  const selectedMascot = mascots?.data?.find(mascot => mascot.mascot_id === selectedMascotId) ||
                        (Array.isArray(mascots) ? mascots.find(mascot => mascot.mascot_id === selectedMascotId) : null);

  if (isLoadingChild || isLoadingMascots) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunshine-bg to-sunshine-surface p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 bg-white flex flex-col md:flex-row items-center gap-6">
            {selectedMascot ? (
              <img src={selectedMascot.image_url} alt={selectedMascot.name_en} className="w-32 h-32 rounded-full object-cover border-4 border-sunshine-primary" />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-sunshine-text">{childData?.name || 'My Profile'}</h1>
              <p className="text-sunshine-text-secondary text-lg">{t('Welcome back, let\'s customize your profile!')}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MascotGallery onSelectMascot={setSelectedMascotId} selectedMascotId={selectedMascotId} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateMascotMutation.isPending || selectedMascotId === childData?.selected_mascot_id}
              size="lg"
            >
              {updateMascotMutation.isPending ? t('Saving...') : t('Save Changes')}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChildProfile;
