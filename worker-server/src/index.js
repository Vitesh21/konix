require('dotenv').config();
const stan = require('node-nats-streaming');
const cron = require('node-cron');

// Connect to NATS
const natsClient = stan.connect(
  process.env.NATS_CLUSTER_ID,
  process.env.NATS_CLIENT_ID,
  { url: process.env.NATS_URL }
);

natsClient.on('connect', () => {
  console.log('Connected to NATS');

  // Schedule job to run every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    console.log('Publishing update event');
    natsClient.publish('crypto.update', JSON.stringify({ trigger: 'update' }), (err) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        console.log('Update event published successfully');
      }
    });
  });
});

natsClient.on('error', (error) => {
  console.error('NATS connection error:', error);
});
