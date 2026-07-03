const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const schedulerRoutes = require('./routes/schedulerRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/orders', orderRoutes);
app.use('/api/scheduler', schedulerRoutes);

app.use(errorHandler);

module.exports = app;
