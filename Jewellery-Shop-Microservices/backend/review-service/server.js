const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'review-service', status: 'healthy', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://review-db:27017/jewellery-reviews')
  .then(() => {
    console.log('Review Service: MongoDB connected');
    app.listen(PORT, () => console.log(`Review Service running on port ${PORT}`));
  })
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

module.exports = app;
