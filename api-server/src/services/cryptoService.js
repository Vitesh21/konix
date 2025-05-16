const axios = require('axios');
const CryptoStat = require('../models/CryptoStat');

// In-memory storage for demo if MongoDB fails
let inMemoryStats = {};

const storeCryptoStats = async () => {
  try {
    const coins = ['bitcoin', 'ethereum', 'matic-network'];
    
    console.log('Fetching data from CoinGecko API...');
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: coins.join(','),
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_change: true
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    console.log('Processing CoinGecko data...');
    const stats = coins.map(coin => ({
      coin,
      price: response.data[coin].usd,
      marketCap: response.data[coin].usd_market_cap,
      dayChange: response.data[coin].usd_24h_change,
      timestamp: new Date()
    }));

    // Store in-memory as backup
    stats.forEach(stat => {
      if (!inMemoryStats[stat.coin]) {
        inMemoryStats[stat.coin] = [];
      }
      inMemoryStats[stat.coin].push(stat);
      // Keep only the last 100 records
      if (inMemoryStats[stat.coin].length > 100) {
        inMemoryStats[stat.coin].shift();
      }
    });

    try {
      await Promise.all(stats.map(stat => new CryptoStat(stat).save()));
      console.log('Crypto stats stored in MongoDB successfully');
    } catch (dbError) {
      console.error('MongoDB storage failed, using in-memory storage:', dbError.message);
    }
    
    return stats;
  } catch (error) {
    console.error('Error storing crypto stats:', error.message);
    throw error;
  }
};

const getLatestStats = async (coin) => {
  try {
    console.log(`Fetching latest stats for ${coin}...`);
    let stats;
    try {
      stats = await CryptoStat.findOne({ coin })
        .sort({ timestamp: -1 });
    } catch (dbError) {
      console.error('MongoDB query failed:', dbError.message);
    }

    // If MongoDB failed or returned no results, use in-memory data
    if (!stats && inMemoryStats[coin] && inMemoryStats[coin].length > 0) {
      console.log(`Using in-memory data for ${coin}`);
      stats = inMemoryStats[coin][inMemoryStats[coin].length - 1];
    } else if (stats) {
      console.log(`Found latest stats for ${coin} in MongoDB`);
    }

    return stats;
  } catch (error) {
    console.error('Error fetching latest stats:', error.message);
    throw error;
  }
};

const calculateDeviation = async (coin) => {
  try {
    console.log(`Calculating deviation for ${coin}...`);
    let prices = [];

    try {
      const stats = await CryptoStat.find({ coin })
        .sort({ timestamp: -1 })
        .limit(100)
        .select('price');
      prices = stats.map(stat => stat.price);
      console.log(`Found ${prices.length} records in MongoDB`);
    } catch (dbError) {
      console.error('MongoDB query failed:', dbError.message);
    }

    // If MongoDB failed or returned insufficient data, use in-memory data
    if (prices.length === 0 && inMemoryStats[coin] && inMemoryStats[coin].length > 0) {
      console.log(`Using in-memory data for deviation calculation of ${coin}`);
      prices = inMemoryStats[coin].map(stat => stat.price);
    }

    if (prices.length === 0) {
      throw new Error(`No data available for ${coin}`);
    }

    console.log(`Calculating deviation from ${prices.length} records`);
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / prices.length;
    const deviation = Math.sqrt(variance);

    return parseFloat(deviation.toFixed(2));
  } catch (error) {
    console.error('Error calculating deviation:', error.message);
    throw error;
  }
};

module.exports = {
  storeCryptoStats,
  getLatestStats,
  calculateDeviation
};
