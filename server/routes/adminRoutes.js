const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const { updateOrderStatusValidation } = require('../utils/validators');

router.use(auth, admin); // All admin routes require auth + admin authorization

router.get('/stats', adminController.getStats);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', updateOrderStatusValidation, validate, adminController.updateOrderStatus);

module.exports = router;
