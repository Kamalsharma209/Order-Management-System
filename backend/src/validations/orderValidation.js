const { body, param, query } = require('express-validator');

const createOrderValidation = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ max: 100 })
    .withMessage('Customer name must be at most 100 characters'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ max: 20 })
    .withMessage('Phone number must be at most 20 characters'),
  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name must be at most 200 characters'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value >= 0)
    .withMessage('Amount cannot be negative'),
  body('paymentStatus')
    .optional()
    .isIn(['PAID', 'PENDING'])
    .withMessage('Payment status must be PAID or PENDING'),
  body('orderStatus')
    .optional()
    .isIn(['PLACED', 'PROCESSING', 'READY_TO_SHIP'])
    .withMessage('Invalid order status'),
];

const updateOrderValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('customerName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Customer name must be at most 100 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be at most 20 characters'),
  body('productName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Product name must be at most 200 characters'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value >= 0)
    .withMessage('Amount cannot be negative'),
  body('paymentStatus')
    .optional()
    .isIn(['PAID', 'PENDING'])
    .withMessage('Payment status must be PAID or PENDING'),
  body('orderStatus')
    .optional()
    .isIn(['PLACED', 'PROCESSING', 'READY_TO_SHIP'])
    .withMessage('Invalid order status'),
];

const getOrderValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

const deleteOrderValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

const listOrdersValidation = [
  query('status')
    .optional()
    .isIn(['PLACED', 'PROCESSING', 'READY_TO_SHIP'])
    .withMessage('Invalid status filter'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isString(),
];

module.exports = {
  createOrderValidation,
  updateOrderValidation,
  getOrderValidation,
  deleteOrderValidation,
  listOrdersValidation,
};
