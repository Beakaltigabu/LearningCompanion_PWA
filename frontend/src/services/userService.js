import { request } from './api';

/**
 * Fetches the current user's profile data.
 * @returns {Promise<Object>} A promise that resolves to the user's profile.
 */
export const getProfile = () => {
  return request('/users/profile');
};

/**
 * Updates the current user's profile data.
 * @param {object} profileData - The data to update.
 * @returns {Promise<Object>} A promise that resolves to the updated user profile.
 */
export const updateProfile = (profileData) => {
  return request('/users/profile', {
    method: 'PUT',
    body: profileData,
  });
};
