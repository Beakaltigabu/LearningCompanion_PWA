import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, UserCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChildren, createChild, updateChildProfile, deleteChild } from '../../services/childService';
import { getMascots } from '../../services/mascotService';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import Modal from '../common/Modal';
import useToastStore from '../../store/toastStore';
import ChildProfileEditor from './ChildProfileEditor';

const ChildManagementList = () => {
  const { t } = useTranslation('parent');
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [deletingChild, setDeletingChild] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    age: '',
    grade_level: ''
  });

  // Fetch children with proper error handling
  const { data: childrenResponse, isLoading, isError, error } = useQuery({
    queryKey: ['children'],
    queryFn: getChildren,
    onError: (err) => {
      console.error('Error fetching children:', err);
      addToast(`${t('child_management.failed_to_load_children')}: ${err.message}`, 'error');
    },
  });

  // Fetch mascots
  const { data: mascotsResponse } = useQuery({
    queryKey: ['mascots'],
    queryFn: getMascots,
    onError: (err) => {
      console.error('Error fetching mascots:', err);
    },
  });

  // Extract children array from response
  const children = childrenResponse?.children || childrenResponse?.data || childrenResponse || [];
  const mascots = mascotsResponse?.data || mascotsResponse || [];

  console.log('Children data:', children);
  console.log('Mascots data:', mascots);

  const createChildMutation = useMutation({
    mutationFn: createChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      addToast(t('child_management.child_created_successfully'), 'success');
      setIsModalOpen(false);
      setFormData({ name: '', pin: '', age: '', grade_level: '' });
    },
    onError: (err) => {
      addToast(`${t('child_management.failed_to_create_child')}: ${err.message}`, 'error');
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: ({ childId, data }) => updateChildProfile(childId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      addToast(t('child_management.child_updated_successfully'), 'success');
      setIsModalOpen(false);
    },
    onError: (err) => {
      addToast(`${t('child_management.failed_to_update_child')}: ${err.message}`, 'error');
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: deleteChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      addToast(t('child_management.child_deleted_successfully'), 'success');
      setIsDeleteModalOpen(false);
      setDeletingChild(null);
    },
    onError: (err) => {
      addToast(`${t('child_management.failed_to_delete_child')}: ${err.message}`, 'error');
    },
  });

  const handleCreateChild = () => {
    setEditingChild(null);
    setFormData({ name: '', pin: '', age: '', grade_level: '' });
    setIsModalOpen(true);
  };

  const handleEditChild = (child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      pin: '',
      age: child.age || '',
      grade_level: child.grade_level || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (child) => {
    setDeletingChild(child);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingChild) {
      deleteChildMutation.mutate(deletingChild.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mutationData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age, 10) : null,
      grade_level: formData.grade_level,
    };

    if (formData.pin) {
      mutationData.pin = formData.pin;
    }

    if (editingChild) {
      updateChildMutation.mutate({ childId: editingChild.id, data: mutationData });
    } else {
      createChildMutation.mutate(mutationData);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingChild(null);
    setFormData({ name: '', pin: '', age: '', grade_level: '' });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">{t('child_management.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="text-center text-red-500">
          <p>{t('child_management.failed_to_load_children')}: {error?.message}</p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['children'] })}
            className="mt-4"
          >
            {t('common.try_again')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {t('child_management.title')}
          </h2>
          <p className="text-text-secondary mt-1">
            {t('child_management.description')}
          </p>
        </div>
        <Button
          onClick={handleCreateChild}
          className="bg-primary hover:bg-primary-hover text-white"
          userType="parent"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('child_management.add_child')}
        </Button>
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <Card className="p-12 text-center bg-surface border border-border">
          <UserCircle className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {t('child_management.no_children_yet')}
          </h3>
          <p className="text-text-secondary mb-6">
            {t('child_management.create_first_child_profile')}
          </p>
          <Button
            onClick={handleCreateChild}
            className="bg-primary hover:bg-primary-hover text-white"
            userType="parent"
          >
            {t('child_management.add_first_child')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow bg-surface border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle className="w-12 h-12 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{child.name}</h3>
                    <p className="text-sm text-text-secondary">
                      {child.age && `${t('profile.age')}: ${child.age}`}
                      {child.age && child.grade_level && ' • '}
                      {child.grade_level && `${t('profile.grade')}: ${child.grade_level}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditChild(child)}
                    className="flex-1 border-border hover:bg-surface-hover"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(child)}
                    className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingChild ? t('child_management.edit_child') : t('child_management.create_child')}
        className="bg-surface border border-border"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('child_management.child_name')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-background border-border text-text-primary"
            required
          />

          <Input
            label={t('child_management.pin')}
            type="password"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            className="bg-background border-border text-text-primary"
            placeholder={editingChild ? t('child_management.leave_blank_keep_current') : t('child_management.enter_4_digit_pin')}
            required={!editingChild}
          />

          <Input
            label={t('child_management.age')}
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="bg-background border-border text-text-primary"
            min="3"
            max="18"
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t('child_management.grade_level')}
            </label>
            <select
              value={formData.grade_level}
              onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
            >
              <option value="">{t('child_management.select_grade')}</option>
              <option value="Pre-K">Pre-K</option>
              <option value="K">Kindergarten</option>
              <option value="1st">1st Grade</option>
              <option value="2nd">2nd Grade</option>
              <option value="3rd">3rd Grade</option>
              <option value="4th">4th Grade</option>
              <option value="5th">5th Grade</option>
              <option value="6th">6th Grade</option>
              <option value="7th">7th Grade</option>
              <option value="8th">8th Grade</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              userType="parent"
              disabled={createChildMutation.isPending || updateChildMutation.isPending || !formData.name || (!editingChild && !formData.pin)}
            >
              {createChildMutation.isPending || updateChildMutation.isPending ? t('child_management.saving') : t('child_management.save_child')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('child_management.confirm_delete')}
        className="bg-surface border border-border"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                {t('child_management.delete_warning')}
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                {t('child_management.delete_child_message', { name: deletingChild?.name })}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteChildMutation.isPending}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              userType="parent"
            >
              {deleteChildMutation.isPending ? t('child_management.deleting') : t('child_management.yes_delete')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 border-border hover:bg-surface-hover text-text-primary"
              userType="parent"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChildManagementList;
