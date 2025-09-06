const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET;


const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    // Add any other user info you want in the token
  };
  
  // Token expires in 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const authenticateToken = (req, res, next) => {
  console.log('Auth middleware triggered');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  // Extract token from "Bearer TOKEN" format
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Extracted token:', token);
  
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    // Verify the token using our verifyToken function
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('Token verification failed: Invalid or expired token');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    console.log('Decoded user:', decoded);
    // Add user info to request object so other routes can use it
    req.user = decoded;
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = {
  hashPassword: hashPassword,
  comparePassword: comparePassword,
  generateToken: generateToken,
  verifyToken: verifyToken,
  authenticateToken: authenticateToken,
  
};
