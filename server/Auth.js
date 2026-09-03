const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// TEMPORARY credentials — replace with a real user store + hashed passwords
// before shipping this anywhere near production.
const TEMP_USERNAME = "admin";
const TEMP_PASSWORD = "admin123";

// In-memory session token store. Swap for JWT or a real session store later.
const activeTokens = new Set();

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (email !== TEMP_USERNAME || password !== TEMP_PASSWORD) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = generateToken();
  activeTokens.add(token);

  return res.status(200).json({
    token,
    user: { email: TEMP_USERNAME, role: "admin" },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  activeTokens.delete(token);
  return res.status(200).json({ message: "Logged out." });
});

// GET /api/auth/verify — used to check if a stored token is still valid
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ valid: false });
  }

  return res.status(200).json({ valid: true, user: { email: TEMP_USERNAME, role: "admin" } });
});

module.exports = router;