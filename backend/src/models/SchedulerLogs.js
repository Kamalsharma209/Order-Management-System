const mongoose = require('mongoose');

const schedulerLogSchema = new mongoose.Schema({
  startedAt: {
    type: Date,
    required: true,
  },
  endedAt: {
    type: Date,
    required: true,
  },
  checkedOrders: {
    type: Number,
    default: 0,
  },
  updatedOrders: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
});

schedulerLogSchema.index({ startedAt: -1 });

module.exports = mongoose.model('SchedulerLog', schedulerLogSchema);
