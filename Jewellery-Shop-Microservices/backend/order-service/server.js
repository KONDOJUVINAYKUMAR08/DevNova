const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'healthy', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://order-db:27017/jewellery-orders')
  .then(() => {
    console.log('Order Service: MongoDB connected');
    app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
  })
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

module.exports = app;
