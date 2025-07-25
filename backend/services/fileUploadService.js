import supabase from '../config/supabaseClient.js';
import path from 'path';

const BUCKET_NAME = 'mascot-images';

/**
 * @desc Uploads a file to Supabase Storage.
 * @param {object} fileObject - The file object from multer (req.file).
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadFile = async (fileObject) => {
  if (!fileObject) {
    throw new Error('No file object provided for upload.');
  }

  const fileName = `mascot_${Date.now()}${path.extname(fileObject.originalname)}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileObject.buffer, {
      contentType: fileObject.mimetype,
      upsert: false, // Do not overwrite existing files
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Failed to upload file to Supabase Storage.');
  }

  // Get the public URL of the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Could not retrieve public URL for the uploaded file.');
  }

  return publicUrlData.publicUrl;
};

/**
 * @desc Deletes a file from Supabase Storage.
 * @param {string} fileUrl - The public URL of the file to delete.
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) {
    console.warn('No file URL provided for deletion.');
    return;
  }

  // Extract the file path from the full URL
  const urlParts = fileUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileName]);

  if (error) {
    console.error('Supabase deletion error:', error);
    // We can choose to not throw an error here to prevent a failed deletion
    // from breaking a larger operation (like deleting a mascot record).
  }
};
