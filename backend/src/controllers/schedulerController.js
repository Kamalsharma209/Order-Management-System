const asyncHandler = require('../middleware/asyncHandler');
const { runScheduler } = require('../services/schedulerService');
const SchedulerLog = require('../models/SchedulerLogs');

const triggerScheduler = asyncHandler(async (_req, res) => {
  await runScheduler();
  res.status(200).json({ success: true, message: 'Scheduler execution completed' });
});

const getSchedulerLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    SchedulerLog.find().sort({ startedAt: -1 }).skip(skip).limit(limit),
    SchedulerLog.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = { triggerScheduler, getSchedulerLogs };
