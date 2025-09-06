const express = require("express");
<<<<<<< HEAD
=======
const { PrismaClient } = require("@prisma/client");
const { hashPassword, generateToken, comparePassword, authenticateToken } = require("../../middleware/auth"); // Assuming all auth functions are in one file

>>>>>>> main
const router = express.Router();

// --- Mock Helper Functions ---

// 1. A mock function to simulate generating a JWT token
const generateFakeToken = (user) => {
  return `fake-jwt-token-for-${user.email}`;
};

// 2. A mock middleware to simulate checking a token
const authenticateFakeToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }
  
  // For testing, we assume any token is valid
  console.log("Mock authentication successful. Attaching mock user.");
  req.user = { userId: 1, email: 'test@example.com' };
  next();
};

// --- Mock API Routes ---

<<<<<<< HEAD
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy (mock mode)" });
});

// Mock Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("Mock /signup endpoint hit with body:", req.body);
    const { firstName, lastName, email, password, userAddress } = req.body;

    // Basic validation
    if (!email || !password || !userAddress || !firstName) {
      return res.status(400).json({ 
        error: "Mock Error: First name, email, password, and address are required." 
      });
=======
// --- Live API Routes ---

// SIGNUP: Create a new user in the database
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, userAddress, phone } = req.body;

    // Validate required fields
    if (!email || !password || !userAddress || !firstName) {
      return res.status(400).json({ error: "First name, email, password, and user address are required." });
>>>>>>> main
    }

<<<<<<< HEAD
    // Simulate successful creation
    const fakeUser = { id: Date.now(), email, firstName, lastName };
    const token = generateFakeToken(fakeUser);
    
=======
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        userAddress,
        phone,
      },
      select: { // Only select the fields you want to return
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });

<<<<<<< HEAD
    // Generate JWT token
    const token = generateToken(user);
    const refreshToken = generateToken(user);
   
    await prisma.user.update({
      where: { id: user.id },
      data: { jwtToken: token, refreshToken: refreshToken },
      select: {
        id: true, 
        firstName: true,
        lastName: true,
        email: true,
        location: true,
        phone: true,
        createdAt: true,
      }
    });
=======
    // Generate a token for the new user
    const token = generateToken(newUser);
>>>>>>> main

>>>>>>> aishwarya
    res.status(201).json({
<<<<<<< HEAD
      message: "Mock user created successfully",
      user: fakeUser,
=======
      message: "User created successfully",
      user: newUser,
>>>>>>> main
      token: token,
    });
  } catch (error) {
<<<<<<< HEAD
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error during signup" });
  }
});

// Mock Login route
=======
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error during signup." });
  }
});

// LOGIN: Verify user and return a token
>>>>>>> main
router.post("/login", async (req, res) => {
  try {
    console.log("Mock /login endpoint hit with body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
<<<<<<< HEAD
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check against hardcoded credentials for testing
    if (email === "test@example.com" && password === "password123") {
      const mockUser = {
        id: 1,
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      };
      const token = generateFakeToken(mockUser);
      
      res.json({
        message: "Login successful",
        user: mockUser,
        token: token,
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

// Mock Example protected route
router.get("/profile", authenticateFakeToken, async (req, res) => {
  try {
    // Return a hardcoded profile based on the mock user
    const mockProfile = {
      id: req.user.userId,
      firstName: "Test",
      lastName: "User",
      email: req.user.email,
    };
    res.json({ user: mockProfile });
=======
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare the provided password with the stored hash
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate a token for the session
    const token = generateToken(user);
    
    // Don't send the password hash back to the client
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// PROFILE: Fetch the authenticated user's profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from the token middleware

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        location: true,
        userAddress: true,
        phone: true,
        profilePictureUrl: true,
        createdAt: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ user: userProfile });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// UPDATE-PROFILE: Update the authenticated user's profile
router.patch("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, userAddress, phone, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        userAddress,
        phone,
        location,
      },
      select: { // Return the updated user data
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userAddress: true,
        phone: true,
        location: true,
      }
    });

    res.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
>>>>>>> main
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Mock Update Profile route
router.patch("/update-profile", authenticateFakeToken, async (req, res) => {
  try {
    console.log("Mock /update-profile hit with body:", req.body);
    const { firstName, lastName } = req.body;
    
    // Simulate updating the user
    const updatedUser = {
      id: req.user.userId,
      email: req.user.email,
      firstName: firstName || "Test",
      lastName: lastName || "User",
    };

    res.json({ 
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mock Logout route
router.post("/logout", authenticateFakeToken, async (req, res) => {
  try {
    console.log("Mock /logout hit for user:", req.user.userId);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
