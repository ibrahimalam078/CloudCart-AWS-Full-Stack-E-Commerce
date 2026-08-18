const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addToCartValidation, updateCartValidation } = require('../utils/validators');

router.use(auth); // All cart routes are protected

router.get('/', cartController.getCart);
router.post('/', addToCartValidation, validate, cartController.addToCart);
router.put('/:productId', updateCartValidation, validate, cartController.updateCartItem);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;
