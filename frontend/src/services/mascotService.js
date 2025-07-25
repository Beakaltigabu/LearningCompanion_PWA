import { request } from './api';

/**
 * Fetches all available mascots.
 * @returns {Promise<Array>} A promise that resolves to an array of mascots.
 */
export const getMascots = () => {
  return request('/mascots');
};

/**
 * Fetches a single mascot by its ID.
 * @param {string} mascotId - The ID of the mascot to fetch.
 * @returns {Promise<Object>} A promise that resolves to the mascot object.
 */
export const getMascotById = (mascotId) => {
  return request(`/mascots/${mascotId}`);
};
