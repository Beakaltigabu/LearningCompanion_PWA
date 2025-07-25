import { request } from './api';

/**
 * Fetches all children for the logged-in parent.
 * @returns {Promise<Array>} A promise that resolves to an array of children.
 */
export const getChildren = () => {
  return request('/children');
};


/**
 * Fetches the profile for a specific child.
 * @param {string} childId - The ID of the child.
 * @returns {Promise<Object>} A promise that resolves to the child's profile data.
 */
export const getChildProfile = (childId) => {
  if (!childId) throw new Error('Child ID is required.');
  return request(`/children/${childId}`);
};

/**
 * Updates the profile for a specific child.
 * @param {string} childId - The ID of the child.
 * @param {object} profileData - The data to update.
 * @returns {Promise<Object>} A promise that resolves to the updated child profile.
 */
export const updateChildProfile = (childId, profileData) => {
  if (!childId) throw new Error('Child ID is required.');
  return request(`/children/${childId}`, {
    method: 'PUT',
    body: profileData,
  });
};

/**
 * Creates a new child for the logged-in parent.
 * @param {object} childData - The data for the new child.
 * @returns {Promise<Object>} A promise that resolves to the new child object.
 */
export const createChild = (childData) => {
  return request('/children', {
    method: 'POST',
    body: childData,
  });
};

/**
 * Deletes a specific child.
 * @param {string} childId - The ID of the child to delete.
 * @returns {Promise<Object>} A promise that resolves on successful deletion.
 */
export const deleteChild = (childId) => {
  if (!childId) throw new Error('Child ID is required.');
  return request(`/children/${childId}`, {
    method: 'DELETE',
  });
};
