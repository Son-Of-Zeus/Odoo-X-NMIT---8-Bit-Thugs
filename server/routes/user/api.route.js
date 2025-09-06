const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { hashPassword, generateToken, comparePassword, authenticateToken } = require("../../middleware/auth"); // Assuming all auth functions are in one file

const router = express.Router();
const prisma = new PrismaClient();

// --- Live API Routes ---

// SIGNUP: Create a new user in the database
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, userAddress, phone } = req.body;

    // Validate required fields
    if (!email || !password || !userAddress || !firstName) {
      return res.status(400).json({ error: "First name, email, password, and user address are required." });
    }

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

    // Generate a token for the new user
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error during signup." });
  }
});

// LOGIN: Verify user and return a token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
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
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
