import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateChild } from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

const ChildProfile = () => {
  const { t } = useTranslation();
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [selectedMascot, setSelectedMascot] = useState(null);

  useEffect(() => {
    // Fetch child data
    const fetchChild = async () => {
      try {
        // This would be replaced with actual API call
        // const childData = await getChild(childId);
        // setChild(childData);
        // setName(childData.name);
        // setSelectedMascot(childData.mascotId);
        setLoading(false);
      } catch (error) {
        toast.error(t('child_management.failed_to_load_children'));
        setLoading(false);
      }
    };

    if (childId) {
      fetchChild();
    }
  }, [childId, t]);

  const handleSave = async () => {
    const toastId = toast.loading(t('common.loading'));
    try {
      const updatedData = {
        name,
        mascotId: selectedMascot || null,
      };
      await updateChild(childId, updatedData);
      toast.success(t('child_management.child_updated_successfully'), { id: toastId });
      navigate('/parent/dashboard');
    } catch (error) {
      toast.error(error.message || t('child_management.operation_failed'), { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{t('child_management.failed_to_load_children')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">{t('child_management.edit_child')}</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('child_management.child_name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('child_management.child_name')}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {t('common.save')}
            </button>
            <button
              onClick={() => navigate('/parent/dashboard')}
              className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;
