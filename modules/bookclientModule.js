const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const bookclientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, `Ismingizni kiriting`],
  },
  clientNumber: {
    type: String,
    required: [true, 'Telefon raqamingizni kiriting'],
  },
  description: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Bookclient = mongoose.model('Bookclient', bookclientSchema);
module.exports = Bookclient;
