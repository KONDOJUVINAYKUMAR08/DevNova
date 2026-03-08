const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  categoryName: {
    type: String,
    trim: true
  },
  metalType: {
    type: String,
    enum: ['gold', 'silver', 'platinum', 'diamond'],
    required: true
  },
  purity: {
    type: String,
    required: true,
    trim: true  // e.g. "22K", "24K", "925"
  },
  netWeight: {
    type: Number,
    required: [true, 'Net weight is required'],
    min: 0
  },
  grossWeight: {
    type: Number,
    min: 0
  },
  makingCharges: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  images: [{
    type: String  // URL or path
  }],
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ metalType: 1, purity: 1 });

module.exports = mongoose.model('Product', productSchema);
