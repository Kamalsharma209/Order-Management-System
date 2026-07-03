const { AppError } = require('./errorHandler');

const requireSecretKey = (req, _res, next) => {
  const secretKey = req.headers['x-secret-key'];
  if (!secretKey || secretKey !== process.env.SCHEDULER_SECRET) {
    return next(new AppError('Unauthorized: Invalid secret key', 401));
  }
  next();
};

module.exports = { requireSecretKey };
