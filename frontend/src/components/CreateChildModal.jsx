import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Input } from './common/Input';
import { Button } from './common/Button';
import * as api from '../services/api';

const CreateChildModal = ({ onClose, onSuccess }) => {
  const { t } = useTranslation('parent');
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    age: '',
    grade_level: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('child-', '')]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const childData = {
        name: formData.name,
        pin: formData.pin,
        age: formData.age ? parseInt(formData.age) : null,
        grade_level: formData.grade_level || null
      };

      await api.createChild(childData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t('child_management.failed_to_create_child'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('child_management.create_child')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="child-name"
              label={t('child_management.child_name')}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              id="child-pin"
              label={t('child_management.four_digit_pin')}
              type="password"
              value={formData.pin}
              onChange={handleChange}
              maxLength={4}
              pattern="\d{4}"
              required
            />

            <Input
              id="child-age"
              label={t('child_management.age_optional')}
              type="number"
              value={formData.age}
              onChange={handleChange}
              min={1}
              max={18}
            />

            <Input
              id="child-grade_level"
              label={t('child_management.grade_level_optional')}
              value={formData.grade_level}
              onChange={handleChange}
              placeholder={t('child_management.grade_placeholder')}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white"
              >
                {isLoading ? t('common.loading') : t('child_management.create_child')}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateChildModal;
