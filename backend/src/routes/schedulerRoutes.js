const express = require('express');
const router = express.Router();
const { triggerScheduler, getSchedulerLogs } = require('../controllers/schedulerController');
const { requireSecretKey } = require('../middleware/auth');

router.post('/run', requireSecretKey, triggerScheduler);
router.get('/logs', getSchedulerLogs);

module.exports = router;
