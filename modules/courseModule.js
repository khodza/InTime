const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const courseclientSchema = new mongoose.Schema({
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

const Courseclient = mongoose.model('Courseclient', courseclientSchema);
module.exports = Courseclient;
