import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ────────────────────────────────────────
// Helper — generate JWT token
// ────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check required fields
  if (!username || !email || !password) {
    return sendError(res, "All fields are required", 400);
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return sendError(res, "Email already registered", 400);
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return sendError(res, "Username already taken", 400);
  }

  // Create user — password hashed by pre save hook
  const user = await User.create({ username, email, password });

  // Generate token
  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
    "Account created successfully",
    201
  );
});

// ────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return sendError(res, "Email and password are required", 400);
  }

  // Find user — explicitly select password (select: false by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return sendError(res, "Invalid email or password", 401);
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, "Invalid email or password", 401);
  }

  // Generate token
  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
    "Login successful"
  );
});

// ────────────────────────────────────────
// @route   POST /api/auth/logout
// @access  Protected
// ────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Decode to get expiry time
  const decoded = jwt.decode(token);

  // Add token to blacklist
  await TokenBlacklist.create({
    token,
    userId: req.user._id,
    expiresAt: new Date(decoded.exp * 1000), // convert unix to Date
  });

  return sendSuccess(res, null, "Logged out successfully");
});