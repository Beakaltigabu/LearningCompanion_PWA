import logger from '../utils/logger.js';

const errorLogger = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    details: err.details || null,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: req.user || null,
  });
  next(err);
};

export default errorLogger;
