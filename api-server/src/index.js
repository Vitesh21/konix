require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cryptoRoutes = require('./routes/cryptoRoutes');
const { storeCryptoStats } = require('./services/cryptoService');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Simulate NATS connection (for demo)
console.log('NATS connection simulated for demo');

// Store initial crypto stats
(async () => {
  console.log('Collecting initial crypto stats...');
  try {
    await storeCryptoStats();
    console.log('Initial crypto stats collected successfully');
  } catch (error) {
    console.error('Error collecting initial crypto stats:', error);
  }
})();

// Simulate message from worker every 60 seconds for demo
setInterval(async () => {
  console.log('Received simulated update message');
  try {
    await storeCryptoStats();
    console.log('Updated crypto stats successfully');
  } catch (error) {
    console.error('Error updating crypto stats:', error);
  }
}, 60000);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Cryptocurrency Statistics API',
    endpoints: {
      stats: '/api/stats?coin=[bitcoin|ethereum|matic-network]',
      deviation: '/api/deviation?coin=[bitcoin|ethereum|matic-network]'
    }
  });
});

// Routes
app.use('/api', cryptoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
