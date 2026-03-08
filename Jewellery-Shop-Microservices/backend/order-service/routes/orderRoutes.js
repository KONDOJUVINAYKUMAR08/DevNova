const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getMyOrders);
router.get('/all', auth, adminOnly, orderController.getAllOrders);
router.get('/stats', auth, adminOnly, orderController.getOrderStats);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, adminOnly, orderController.updateOrderStatus);
router.delete('/:id', auth, adminOnly, orderController.deleteOrder);

module.exports = router;
