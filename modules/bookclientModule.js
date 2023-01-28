const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const bookclientSchema = new mongoose.Schema({
  klient: {
    type: String,
    required: [true, `Ismingizni kiriting`],
  },
  tel_raqam: {
    type: String,
    required: [true, 'Telefon raqamingizni kiriting'],
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
  voqti: {
    type: String,
  },
});

const Bookclient = mongoose.model('Bookclient', bookclientSchema);
module.exports = Bookclient;
