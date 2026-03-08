const Rate = require('../models/Rate');

// GET /api/rates
exports.getAllRates = async (req, res) => {
  try {
    const rates = await Rate.find().sort({ metalType: 1, purity: 1 });
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/rates/:metalType
exports.getRateByMetal = async (req, res) => {
  try {
    const rates = await Rate.find({ metalType: req.params.metalType });
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/rates (Admin) — update or create rate
exports.updateRate = async (req, res) => {
  try {
    const { metalType, purity, ratePerGram } = req.body;

    let rate = await Rate.findOne({ metalType, purity });
    if (rate) {
      rate.previousRate = rate.ratePerGram;
      rate.change = ratePerGram - rate.ratePerGram;
      rate.changePercent = rate.ratePerGram > 0
        ? parseFloat(((ratePerGram - rate.ratePerGram) / rate.ratePerGram * 100).toFixed(2))
        : 0;
      rate.ratePerGram = ratePerGram;
      rate.updatedBy = req.user?.name || 'admin';
    } else {
      rate = new Rate({
        metalType,
        purity,
        ratePerGram,
        previousRate: 0,
        change: 0,
        changePercent: 0,
        updatedBy: req.user?.name || 'admin'
      });
    }

    await rate.save();
    res.json({ message: 'Rate updated', rate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/rates/bulk (Admin) — update multiple rates
exports.bulkUpdateRates = async (req, res) => {
  try {
    const { rates } = req.body; // [{metalType, purity, ratePerGram}]
    const results = [];

    for (const r of rates) {
      let rate = await Rate.findOne({ metalType: r.metalType, purity: r.purity });
      if (rate) {
        rate.previousRate = rate.ratePerGram;
        rate.change = r.ratePerGram - rate.ratePerGram;
        rate.changePercent = rate.ratePerGram > 0
          ? parseFloat(((r.ratePerGram - rate.ratePerGram) / rate.ratePerGram * 100).toFixed(2))
          : 0;
        rate.ratePerGram = r.ratePerGram;
        rate.updatedBy = req.user?.name || 'admin';
      } else {
        rate = new Rate({ ...r, updatedBy: req.user?.name || 'admin' });
      }
      await rate.save();
      results.push(rate);
    }

    res.json({ message: 'Rates updated', rates: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/rates/seed (Admin) — seed initial rates
exports.seedRates = async (req, res) => {
  try {
    const count = await Rate.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Rates already seeded' });
    }

    const defaultRates = [
      { metalType: 'gold', purity: '24K', ratePerGram: 7200, updatedBy: 'system' },
      { metalType: 'gold', purity: '22K', ratePerGram: 6600, updatedBy: 'system' },
      { metalType: 'gold', purity: '18K', ratePerGram: 5400, updatedBy: 'system' },
      { metalType: 'silver', purity: '999', ratePerGram: 85, updatedBy: 'system' },
      { metalType: 'silver', purity: '925', ratePerGram: 78, updatedBy: 'system' },
      { metalType: 'platinum', purity: '950', ratePerGram: 3200, updatedBy: 'system' }
    ];

    await Rate.insertMany(defaultRates);
    res.status(201).json({ message: 'Default rates seeded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
