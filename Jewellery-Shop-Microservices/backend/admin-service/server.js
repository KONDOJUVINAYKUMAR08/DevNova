const express = require('express');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 4006;

app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'admin-service', status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);
});

module.exports = app;
