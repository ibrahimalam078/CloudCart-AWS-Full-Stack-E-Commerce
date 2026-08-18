const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
  productValidation,
  mongoIdValidation,
  productQueryValidation,
} = require('../utils/validators');

// Public routes
router.get('/', productQueryValidation, validate, productController.getProducts);
router.get('/:id', mongoIdValidation, validate, productController.getProductById);

// Admin protected routes
router.post(
  '/',
  auth,
  admin,
  upload.single('image'),
  productValidation,
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  auth,
  admin,
  upload.single('image'),
  mongoIdValidation,
  validate,
  productController.updateProduct
);

router.delete(
  '/:id',
  auth,
  admin,
  mongoIdValidation,
  validate,
  productController.deleteProduct
);

module.exports = router;
