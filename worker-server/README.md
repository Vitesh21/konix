# Worker Server for Cryptocurrency Statistics

This server runs background jobs to trigger cryptocurrency data collection by publishing events to a message queue at regular intervals.

## Features

- Scheduled background job running every 15 minutes
- NATS message publishing for event-driven architecture
- Configurable timing parameters
- Resilient error handling and retry logic

## Tech Stack

- Node.js
- node-cron for scheduled tasks
- NATS Streaming for message queue
- dotenv for environment configuration

## Setup Instructions

### Prerequisites
- Node.js 14+
- NATS Streaming Server

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create or edit `.env` file with the following variables:
```
NATS_URL=nats://localhost:4222
NATS_CLUSTER_ID=crypto-stats
NATS_CLIENT_ID=worker-server
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Architecture Details

### Components

1. **Cron Job Scheduler**: Runs tasks at specified intervals (every 15 minutes)
2. **NATS Publisher**: Publishes events to the message queue
3. **Environment Configuration**: Provides flexibility for different deployment environments

### Data Flow

1. Worker server starts a cron job scheduled for every 15 minutes
2. When triggered, the job publishes an event to the NATS streaming server
3. The event contains a simple message: `{ "trigger": "update" }`
4. The api-server, subscribed to this event, processes it and fetches updated crypto data

## Error Handling

- NATS connection issues are logged with detailed error messages
- Failed publishing attempts include retry logic
- Graceful shutdown handling

## Deployment

This server can be deployed to any Node.js hosting platform:

1. Heroku:
```bash
heroku create
git push heroku main
```

2. AWS Elastic Beanstalk:
Configure `package.json` start script and deploy using AWS CLI or console.

3. Docker:
A simple Dockerfile can be created for containerized deployment:

```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

## Monitoring

For production environments, consider adding monitoring:

1. Add logging to external service (Winston + Loggly/Papertrail)
2. Set up health check endpoint
3. Configure alerts for failed job runs
