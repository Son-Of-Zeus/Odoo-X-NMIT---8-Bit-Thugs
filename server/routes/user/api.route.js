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

    // Validate required fields
    if (!email || !password || !userAddress) {
      return res.status(400).json({ 
        error: "Email, password, and user address are required" 
      });
    }

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
  


 

    res.status(201).json({
      message: "User created successfully",
      user,
      token: token, // This is the JWT token the client should store
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      error: "Internal server error during signup" 
    });
  }
});

// Mock Login route
router.post("/login", async (req, res) => {
  console.log("Mock /login endpoint hit with body:", req.body);
  const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const jwtToken = generateToken(user);
    const refreshToken = generateToken(user);

    // Return user info (without password) and token
    const { passwordHash, ...userWithoutPassword } = user;

    //update the user with the jwtToken and refreshToken
    await prisma.user.update({
      where: { id: user.id },
      data: { jwtToken: jwtToken, refreshToken: refreshToken },
    });
    
    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token: jwtToken,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "Internal server error during login" 
    });
  }
});

// Example protected route - requires authentication
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // req.user is available because of authenticateToken middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/update-profile", authenticateToken, async (req, res) => {
  try {

    const { firstName, lastName, location, phone, userAddress } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { firstName, lastName, location, phone, userAddress },
    });
    res.json({ 
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { jwtToken: null, refreshToken: null },
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  });




module.exports = router;
