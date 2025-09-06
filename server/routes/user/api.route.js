const express = require("express");
const router = express.Router();

// --- We have commented out database and real authentication dependencies ---
// const { PrismaClient } = require("@prisma/client");
// const { hashPassword, generateToken, comparePassword } = require("../../middleware/auth");
// const { authenticateToken } = require("../../middleware/auth");
// const prisma = new PrismaClient();


// --- Mock Helper Functions ---

// 1. A mock function to simulate generating a JWT token
const generateFakeToken = (user) => {
  // In a real app, this creates a signed token. Here, it's just a string.
  return `fake-jwt-token-for-${user.email}`;
};

// 2. A mock middleware to simulate checking a token
const authenticateFakeToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // No token was sent
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }
  
  // For testing, we assume any token is valid and attach a mock user to the request
  console.log("Mock authentication successful. Attaching mock user.");
  req.user = { userId: 1, email: 'test@example.com' };
  next(); // Proceed to the protected route
};


// --- Mock API Routes ---

router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy (mock mode)" });
});

// Mock Signup route
router.post("/signup", async (req, res) => {
  console.log("Mock /signup endpoint hit with body:", req.body);
  const { firstName, lastName, email, password, userAddress } = req.body;

  // Basic validation to ensure the frontend is sending the right data
  if (!email || !password || !firstName || !lastName || !userAddress) {
    return res.status(400).json({ 
      error: "Mock Error: All fields (firstName, lastName, email, password, userAddress) are required." 
    });
  }

  // Simulate a successful signup
  console.log(`Simulating signup for ${email}`);
  const fakeToken = generateFakeToken({ email });
  
  res.status(201).json({
    message: "Mock user created successfully",
    token: fakeToken, // Send back the fake token
  });
});

// Mock Login route
router.post("/login", async (req, res) => {
  console.log("Mock /login endpoint hit with body:", req.body);
  const { email, password } = req.body;

  // Validate that email and password were sent
  if (!email || !password) {
    return res.status(400).json({ error: "Mock Error: Email and password are required" });
  }

  // Check against hardcoded credentials for a successful login test
  if (email === "test@example.com" && password === "password123") {
    console.log("Mock login successful for test@example.com");
    
    const mockUser = {
      id: 1,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
    };
    
    const fakeToken = generateFakeToken(mockUser);
    
    res.json({
      message: "Mock login successful",
      user: mockUser,
      token: fakeToken,
    });
  } else {
    // If credentials don't match, send an error
    console.log(`Mock login failed for email: ${email}`);
    res.status(401).json({ error: "Mock Error: Invalid email or password" });
  }
});

// Mock Protected route
router.get("/profile", authenticateFakeToken, async (req, res) => {
  // The 'authenticateFakeToken' middleware runs first.
  // If it succeeds, 'req.user' will be available here.
  console.log("Mock /profile endpoint hit for user:", req.user);

  // Return a static, hardcoded user profile
  const mockProfile = {
    id: req.user.userId,
    firstName: "Test",
    lastName: "User",
    email: req.user.email,
    location: "Mockville",
    phone: "555-1234",
    createdAt: new Date().toISOString(),
  };

  res.json({ user: mockProfile });
});

module.exports = router;
