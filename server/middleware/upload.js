const multer = require('multer');
const AppError = require('../utils/AppError');

// Allowed MIME types for product images
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Multer configuration for image uploads.
 * Stores files in memory buffer (for streaming to S3).
 * Validates file type and size.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          `Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, WebP.`,
          400
        ),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
