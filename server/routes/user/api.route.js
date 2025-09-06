const express = require("express");
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
    }

<<<<<<< HEAD
    // Simulate successful creation
    const fakeUser = { id: Date.now(), email, firstName, lastName };
    const token = generateFakeToken(fakeUser);
    
=======
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
   

    // Create the user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword, // Store hashed password
        location,
        phone,
        userAddress,
      },
      // Don't return the password hash in response
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

>>>>>>> aishwarya
    res.status(201).json({
      message: "Mock user created successfully",
      user: fakeUser,
      token: token,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error during signup" });
  }
});

// Mock Login route
router.post("/login", async (req, res) => {
  try {
    console.log("Mock /login endpoint hit with body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
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
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
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
