require('dotenv').config(); // Load environment variables
const express = require("express");
const cors = require("cors"); // 1. Import the cors package
const app = express();

const routes = require("./routes/index.route.js");

// --- Middleware ---
app.use(express.json());

// 2. Use the cors middleware to allow cross-origin requests
// This will enable CORS for all routes and all origins by default.
app.use(cors());

// --- Routes ---
// This line must come AFTER you have used the cors middleware.
app.use("", routes);

const PORT = process.env.PORT || 5001;

// Kill any existing process on this port
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

// Keep the process alive
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Killing existing process...`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});
