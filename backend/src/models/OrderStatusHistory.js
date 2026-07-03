const mongoose = require('mongoose');

const orderStatusHistorySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    index: true,
  },
  previousStatus: {
    type: String,
    required: true,
    enum: ['PLACED', 'PROCESSING', 'READY_TO_SHIP'],
  },
  newStatus: {
    type: String,
    required: true,
    enum: ['PLACED', 'PROCESSING', 'READY_TO_SHIP'],
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

orderStatusHistorySchema.index({ orderId: 1, changedAt: -1 });

module.exports = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);
