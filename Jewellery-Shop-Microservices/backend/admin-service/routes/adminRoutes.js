const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/dashboard', auth, adminOnly, adminController.getDashboard);
router.get('/health-check', auth, adminOnly, adminController.healthCheck);

module.exports = router;
