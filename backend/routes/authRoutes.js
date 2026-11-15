
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const correctEmail = process.env.ADMIN_EMAIL;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctEmail || !correctPassword || !process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Admin configuration is missing"
    });
  }

  if (
    email.trim().toLowerCase() !== correctEmail.toLowerCase() ||
    password !== correctPassword
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const token = jwt.sign(
    { role: "admin", email: correctEmail },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    message: "Admin login successful",
    token
  });
});

module.exports = router;
