const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const s3Client = require('../config/s3');
const config = require('../config');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Upload image buffer to AWS S3, falling back to local storage if S3 is unconfigured or fails
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} originalname - Original file name
 * @param {string} mimetype - MIME type (image/jpeg, etc.)
 * @returns {Promise<{ imageUrl: string, imageKey: string }>}
 */
const uploadImage = async (buffer, originalname, mimetype) => {
  const bucketName = config.aws.s3Bucket;

  // Sanitize filename and create a unique key
  const ext = path.extname(originalname) || '.jpg';
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const localFileName = `${Date.now()}-${uniqueId}${ext}`;
  const imageKey = `products/${localFileName}`;

  // Helper function to save file locally as a fallback
  const saveFileLocally = () => {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localFilePath = path.join(uploadsDir, localFileName);
    fs.writeFileSync(localFilePath, buffer);
    logger.info(`Local upload fallback successful: ${localFileName}`);
    return {
      imageUrl: `/uploads/${localFileName}`,
      imageKey: `local-${localFileName}`,
    };
  };

  // If S3 bucket isn't set (e.g., initial local dev before S3 setup), save locally
  if (!bucketName || bucketName.includes('your-unique-suffix')) {
    logger.warn('AWS S3 Bucket not configured. Using local filesystem storage for upload.');
    return saveFileLocally();
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: imageKey,
      Body: buffer,
      ContentType: mimetype,
    });

    await s3Client.send(command);

    const imageUrl = `https://${bucketName}.s3.${config.aws.region}.amazonaws.com/${imageKey}`;
    logger.info(`S3 upload successful: ${imageKey}`);

    return { imageUrl, imageKey };
  } catch (error) {
    logger.error(`S3 Upload Error: ${error.message}. Falling back to local storage.`);
    try {
      return saveFileLocally();
    } catch (localError) {
      logger.error(`Local Fallback Upload Error: ${localError.message}`);
      throw new AppError(`Failed to upload image: ${localError.message}`, 500);
    }
  }
};

/**
 * Delete image from AWS S3 or local directory
 * @param {string} imageKey - S3 Object key or local file key
 */
const deleteImage = async (imageKey) => {
  if (!imageKey) return;

  // Check if it's a local file
  if (imageKey.startsWith('local-')) {
    const localFileName = imageKey.replace('local-', '');
    const localFilePath = path.join(__dirname, '..', 'public', 'uploads', localFileName);
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        logger.info(`Local file deletion successful: ${localFileName}`);
      }
    } catch (error) {
      logger.error(`Failed to delete local file ${localFileName}: ${error.message}`);
    }
    return;
  }

  const bucketName = config.aws.s3Bucket;

  if (!bucketName || bucketName.includes('your-unique-suffix')) {
    logger.warn('Skipping S3 deletion — bucket not configured.');
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageKey,
    });

    await s3Client.send(command);
    logger.info(`S3 delete successful: ${imageKey}`);
  } catch (error) {
    logger.error(`S3 Delete Error for key ${imageKey}: ${error.message}`);
    // Non-fatal, log and proceed
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
