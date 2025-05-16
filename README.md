# Cryptocurrency Statistics System

This project consists of two Node.js servers that work together to collect and expose cryptocurrency statistics using the CoinGecko API.

## System Architecture

- **api-server**: Handles HTTP requests, stores cryptocurrency data, and provides statistics endpoints
- **worker-server**: Runs background jobs to trigger data collection every 15 minutes
- **MongoDB**: Stores cryptocurrency statistics with historical data for deviation calculations
- **NATS**: Handles inter-server communication for reliable event-driven architecture

## Project Features

- Real-time cryptocurrency data from CoinGecko API
- Standard deviation calculation based on historical price data
- Graceful error handling with fallback to in-memory storage
- CORS support for browser clients
- Event-driven architecture with message queue

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- NATS Streaming Server

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Set up API Server
```bash
cd api-server
npm install
# Configure .env file with MongoDB and NATS settings
npm run dev
```

### 3. Set up Worker Server
```bash
cd worker-server
npm install
# Configure .env file with NATS settings
npm run dev
```

### 4. Testing the System
Open your browser and navigate to:
- `http://localhost:3000/` - API documentation
- `http://localhost:3000/api/stats?coin=bitcoin` - Get latest Bitcoin stats
- `http://localhost:3000/api/deviation?coin=bitcoin` - Get Bitcoin price deviation

## API Endpoints

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

1. The worker-server runs a cron job every 15 minutes to publish an update event to NATS
2. The api-server subscribes to these events and updates the cryptocurrency statistics in MongoDB
3. The api-server calculates the standard deviation of prices from the last 100 records
4. The system uses in-memory fallback if MongoDB is unavailable

## Error Handling

- All endpoints include proper error handling and validation
- MongoDB connection errors are handled with in-memory fallback
- API rate limiting protection with timeouts
- CORS support for browser clients

## Deployment Options

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster and obtain the connection string
3. Update the MONGODB_URI in the api-server .env file

### Cloud Deployment
1. Deploy the api-server and worker-server to platforms like Heroku, AWS, or Azure
2. Set up environment variables for MongoDB and NATS connections
3. Configure CORS for your production domain
