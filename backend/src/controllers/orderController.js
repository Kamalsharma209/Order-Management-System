const asyncHandler = require('../middleware/asyncHandler');
const orderService = require('../services/orderService');
const { validationResult } = require('express-validator');
const { AppError } = require('../middleware/errorHandler');

const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  const order = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, data: order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  const result = await orderService.getAllOrders(req.query);
  res.status(200).json({ success: true, ...result });
});

const getOrderById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  const order = await orderService.getOrderById(req.params.id);
  res.status(200).json({ success: true, data: order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  const order = await orderService.updateOrder(req.params.id, req.body);
  res.status(200).json({ success: true, data: order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }

  await orderService.deleteOrder(req.params.id);
  res.status(200).json({ success: true, message: 'Order deleted successfully' });
});

const getOrderStats = asyncHandler(async (_req, res) => {
  const stats = await orderService.getOrderStats();
  res.status(200).json({ success: true, data: stats });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderStats,
};
