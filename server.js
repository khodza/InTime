const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
require('./telegramBot/actions');
require('./telegramBot/core');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err, '111');
  // console.log(err.name, err.message);
  console.log('Unhandled Rejection * . Shutting down!');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log(`DATABASE CONNECTED SUCCESSFULLY`);
});
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Waiting at port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection .Shutting down!');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log(`SIGTERM IS RECEIVED SHUTTING DOWN  `);
  server.close(() => {
    console.log('Process terminated');
  });
});
