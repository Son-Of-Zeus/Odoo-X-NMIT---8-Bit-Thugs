const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { hashPassword, generateToken, comparePassword } = require("../../middleware/auth");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// Signup route - Create new user with hashed password and return JWT token
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, location, phone, userAddress } = req.body;

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
   
    //i wanna update the user with the jwtToken and refreshToken
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

// Login route - Verify credentials and return JWT token
router.post("/login", async (req, res) => {
  try {
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

    // Return user info (without password) and token
    const { passwordHash, ...userWithoutPassword } = user;
    
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



module.exports = router;
