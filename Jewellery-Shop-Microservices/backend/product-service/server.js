const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'healthy', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://product-db:27017/jewellery-products')
  .then(() => {
    console.log('Product Service: MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Product Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
