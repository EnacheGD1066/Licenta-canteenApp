// user auth route
// This route checks if a user exists in MongoDB and generates a JWT token for authentication.

require("dotenv").config(); 
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checks if the user exists in mongo db
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No user found!" });

    // compares the received pass with the hashed pass 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password!" });

    // generates the jwt token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "5h" }
    );

    // sends the jwt with user credentials
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Please try again later." });
  }
});

module.exports = router;
