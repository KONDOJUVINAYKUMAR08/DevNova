const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const rateRoutes = require('./routes/rateRoutes');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.use('/api/rates', rateRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'rate-service', status: 'healthy', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://rate-db:27017/jewellery-rates')
  .then(() => {
    console.log('Rate Service: MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Rate Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
