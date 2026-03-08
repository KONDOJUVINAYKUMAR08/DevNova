const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
