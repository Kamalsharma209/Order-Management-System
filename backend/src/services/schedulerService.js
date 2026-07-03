const Order = require('../models/Order');
const OrderStatusHistory = require('../models/OrderStatusHistory');
const SchedulerLog = require('../models/SchedulerLogs');

const runScheduler = async () => {
  const startedAt = new Date();
  let checkedOrders = 0;
  let updatedOrders = 0;

  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const placedOrders = await Order.find({
      orderStatus: 'PLACED',
      createdAt: { $lte: tenMinutesAgo },
    });

    const processingOrders = await Order.find({
      orderStatus: 'PROCESSING',
      updatedAt: { $lte: twentyMinutesAgo },
    });

    checkedOrders = placedOrders.length + processingOrders.length;

    for (const order of placedOrders) {
      const result = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: 'PLACED' },
        { $set: { orderStatus: 'PROCESSING' } },
        { new: true }
      );

      if (result) {
        await OrderStatusHistory.create({
          orderId: order.orderId,
          previousStatus: 'PLACED',
          newStatus: 'PROCESSING',
          changedAt: new Date(),
        });
        updatedOrders++;
      }
    }

    for (const order of processingOrders) {
      const result = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: 'PROCESSING' },
        { $set: { orderStatus: 'READY_TO_SHIP' } },
        { new: true }
      );

      if (result) {
        await OrderStatusHistory.create({
          orderId: order.orderId,
          previousStatus: 'PROCESSING',
          newStatus: 'READY_TO_SHIP',
          changedAt: new Date(),
        });
        updatedOrders++;
      }
    }

    await SchedulerLog.create({
      startedAt,
      endedAt: new Date(),
      checkedOrders,
      updatedOrders,
      status: 'SUCCESS',
    });
  } catch (error) {
    await SchedulerLog.create({
      startedAt,
      endedAt: new Date(),
      checkedOrders,
      updatedOrders,
      status: 'FAILED',
      errorMessage: error.message,
    });
  }
};

module.exports = { runScheduler };
