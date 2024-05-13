require("dotenv").config();

// Import required modules and middleware
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const tokenSecret = process.env.TOKEN_SECRET;

// Route to handle user login
router.post("/", async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user is not found or password is incorrect, return error
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({
        error: "invalid email or password",
      });
    }

    // Create user payload for JWT token
    const userForToken = user ? { email: user.email, id: user.id } : null;

    // Generate JWT token with user payload
    const token = jwt.sign(userForToken, tokenSecret, { expiresIn: 60 * 60 });

    // Send token in response
    res.status(200).json({ token });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json(error);
  }
});

// Export the router
module.exports = router;
