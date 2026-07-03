require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startCronJob } = require('./scheduler/cronJob');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  startCronJob();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
