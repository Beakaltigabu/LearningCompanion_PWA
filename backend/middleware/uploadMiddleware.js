import multer from 'multer';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Set up file filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
});

// Middleware for single file upload
export const uploadSingleImage = (fieldName) => {
  return upload.single(fieldName);
};
