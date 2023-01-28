const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const paidClient = new mongoose.Schema({
  klient: {
    type: String,
    required: [true, `Ismingizni kiriting`],
  },
  tel_raqam: {
    type: String,
    required: [true, 'Telefon raqamingizni kiriting'],
  },
  userName: {
    type: String,
  },
  file: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const PaidClient = mongoose.model('PaidClient', paidClient);
module.exports = PaidClient;
