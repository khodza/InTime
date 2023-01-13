const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');

const bookclientRouter = require('./routes/bookclientRouter');
const globalErrorHandler = require('./controllers/errorHandler');

const app = express();
app.use(cors());
app.use(helmet());

if (process.env.NODE === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use('/api/v1/bookusers', bookclientRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `Can not find ${req.originalUrl} on this server!`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
