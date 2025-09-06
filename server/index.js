require('dotenv').config(); // Load environment variables
const express = require("express");
const cors = require("cors"); // 1. Import the cors package
const app = express();

const routes = require("./routes/index.route.js");

// --- Middleware ---
app.use(express.json());
app.use(cors()); // 2. Use cors middleware to allow cross-origin requests

// --- Routes ---
// It's a good practice to prefix your API routes, e.g., app.use("/api", routes);
// However, using "" will also work.
app.use("", routes);

const PORT = process.env.PORT || 5001;

// ... (The rest of your file remains exactly the same) ...

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
