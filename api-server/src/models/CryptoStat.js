const mongoose = require('mongoose');

const cryptoStatSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum: ['bitcoin', 'ethereum', 'matic-network']
  },
  price: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  dayChange: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
cryptoStatSchema.index({ coin: 1, timestamp: -1 });

module.exports = mongoose.model('CryptoStat', cryptoStatSchema);
