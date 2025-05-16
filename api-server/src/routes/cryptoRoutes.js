const express = require('express');
const router = express.Router();
const { getLatestStats, calculateDeviation } = require('../services/cryptoService');

router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!coin) {
      return res.status(400).json({ error: 'Coin parameter is required' });
    }

    const stats = await getLatestStats(coin);
    if (!stats) {
      return res.status(404).json({ error: 'No stats found for the specified coin' });
    }

    res.json({
      price: stats.price,
      marketCap: stats.marketCap,
      "24hChange": stats.dayChange
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!coin) {
      return res.status(400).json({ error: 'Coin parameter is required' });
    }

    const deviation = await calculateDeviation(coin);
    res.json({ deviation });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
