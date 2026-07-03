const cron = require('node-cron');
const { runScheduler } = require('../services/schedulerService');

const startCronJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running scheduler...`);
    await runScheduler();
  });
  console.log('Cron job scheduled: runs every 5 minutes');
};

module.exports = { startCronJob };
