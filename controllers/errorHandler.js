/* eslint-disable no-param-reassign */
const AppError = require('../utils/appError');

const handleCastError = function (err) {
  const message = `Yaroqsiz ${err.path} :${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = function (err) {
  const message = `Dublikat qiymat ${err.keyValue.name}.Iltimos boshqa qiymat kiriting`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Yaroqsiz data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = function (err, res) {
  if (err.isOperational) {
    // catches all the expected errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // catches all the unexpected error
    res.status(500).json({
      status: 'error',
      message: "Xatolik yuz berdi! Keyinroq urinib ko'ring",
    });
  }
};

const handleMulterFileSizeError = function (err) {
  const message = `File hajimi maximum 10 mb`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = handleCastError(err);
    }
    if (err.code === 11000) {
      err = handleDuplicateFields(err);
    }
    if (err._message === 'Validation failed') {
      err = handleValidationErrorDB(err);
    }

    if (err.code === 'LIMIT_FILE_SIZE' || err.message === 'File too large') {
      err = handleMulterFileSizeError(err);
    }

    sendErrorProd(err, res);
  }
};
