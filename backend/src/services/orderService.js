const Order = require('../models/Order');
const OrderStatusHistory = require('../models/OrderStatusHistory');
const generateOrderId = require('../utils/generateOrderId');
const { AppError } = require('../middleware/errorHandler');
const { PAGINATION } = require('../config/constants');

const createOrder = async (orderData) => {
  const orderId = generateOrderId();
  const order = await Order.create({ ...orderData, orderId });
  return order;
};

const getAllOrders = async ({ status, page, limit, search }) => {
  const query = {};
  if (status) query.orderStatus = status;

  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { customerName: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10) || PAGINATION.DEFAULT_PAGE;
  const limitNum = Math.min(
    parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };
};

const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const updateOrder = async (id, updateData) => {
  const order = await Order.findById(id);
  if (!order) throw new AppError('Order not found', 404);

  const previousStatus = order.orderStatus;

  Object.assign(order, updateData);

  if (updateData.orderStatus && previousStatus !== updateData.orderStatus) {
    await OrderStatusHistory.create({
      orderId: order.orderId,
      previousStatus,
      newStatus: updateData.orderStatus,
      changedAt: new Date(),
    });
  }

  await order.save();
  return order;
};

const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const getOrderStats = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        placed: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'PLACED'] }, 1, 0] },
        },
        processing: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'PROCESSING'] }, 1, 0] },
        },
        readyToShip: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'READY_TO_SHIP'] }, 1, 0] },
        },
        paid: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'PENDING'] }, 1, 0] },
        },
      },
    },
  ]);

  return stats[0] || { total: 0, placed: 0, processing: 0, readyToShip: 0, paid: 0, pending: 0 };
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderStats,
};
