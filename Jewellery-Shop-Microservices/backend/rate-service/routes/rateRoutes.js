const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', rateController.getAllRates);
router.get('/:metalType', rateController.getRateByMetal);

router.put('/', auth, adminOnly, rateController.updateRate);
router.post('/bulk', auth, adminOnly, rateController.bulkUpdateRates);
router.post('/seed', rateController.seedRates);

module.exports = router;
