const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createOrderValidation, mongoIdValidation } = require('../utils/validators');

router.use(auth); // All order routes are protected

router.post('/', createOrderValidation, validate, orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', mongoIdValidation, validate, orderController.getOrderById);

module.exports = router;
