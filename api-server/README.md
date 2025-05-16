# API Server for Cryptocurrency Statistics

This server provides REST API endpoints to fetch cryptocurrency statistics and performs standard deviation calculations on historical price data.

## Features

- Fetch real-time cryptocurrency data from CoinGecko API
- Store data in MongoDB with in-memory fallback
- Calculate standard deviation for price volatility analysis
- Subscribe to event queue notifications for automated updates
- CORS support for browser clients

## Tech Stack

- Node.js
- Express.js
- MongoDB
- NATS Streaming
- Axios for API requests

## Setup Instructions

### Prerequisites
- Node.js 14+
- MongoDB (local or cloud)
- NATS Streaming Server

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create or edit `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/crypto-stats
NATS_URL=nats://localhost:4222
NATS_CLUSTER_ID=crypto-stats
NATS_CLIENT_ID=api-server
PORT=3000
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Root Endpoint
```
GET /
```
Returns information about available API endpoints.

### Get Latest Statistics
```
GET /api/stats?coin=bitcoin
```
Query Parameters:
- coin: One of ['bitcoin', 'ethereum', 'matic-network']

Response:
```json
{
    "price": 40000,
    "marketCap": 800000000,
    "24hChange": 3.4
}
```

### Get Price Standard Deviation
```
GET /api/deviation?coin=bitcoin
```
Query Parameters:
- coin: One of ['bitcoin', 'ethereum', 'matic-network']

Response:
```json
{
    "deviation": 4082.48
}
```

## Architecture Details

### Components

1. **Express Server**: Handles HTTP requests and provides REST endpoints
2. **MongoDB Integration**: Stores historical cryptocurrency data
3. **In-Memory Fallback**: Provides resilience if MongoDB is unavailable
4. **NATS Subscriber**: Listens for update events from the worker-server
5. **CoinGecko Service**: Fetches real-time cryptocurrency data

### Data Flow

1. Worker-server publishes an update event to NATS
2. API server receives the event and triggers data collection
3. CoinGecko API is queried for latest cryptocurrency data
4. Data is stored in MongoDB and in-memory backup
5. Clients can query the API endpoints to access the data

## Error Handling

- MongoDB connection issues fall back to in-memory storage
- API timeouts with appropriate retry logic
- Comprehensive error logging
- User-friendly error responses with appropriate HTTP status codes

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
A Dockerfile is provided for containerized deployment.
