const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {
  createOrderValidation,
  updateOrderValidation,
  getOrderValidation,
  deleteOrderValidation,
  listOrdersValidation,
} = require('../validations/orderValidation');

router.get('/stats', orderController.getOrderStats);
router.get('/', listOrdersValidation, orderController.getAllOrders);
router.post('/', createOrderValidation, orderController.createOrder);
router.get('/:id', getOrderValidation, orderController.getOrderById);
router.put('/:id', updateOrderValidation, orderController.updateOrder);
router.delete('/:id', deleteOrderValidation, orderController.deleteOrder);

module.exports = router;
