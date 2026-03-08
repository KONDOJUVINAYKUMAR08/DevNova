const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  metalType: {
    type: String,
    enum: ['gold', 'silver', 'platinum'],
    required: true
  },
  purity: {
    type: String,
    required: true  // e.g. "24K", "22K", "18K", "925"
  },
  ratePerGram: {
    type: Number,
    required: [true, 'Rate per gram is required'],
    min: 0
  },
  previousRate: {
    type: Number,
    default: 0
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true
});

rateSchema.index({ metalType: 1, purity: 1 }, { unique: true });

module.exports = mongoose.model('Rate', rateSchema);
