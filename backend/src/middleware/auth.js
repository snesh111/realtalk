import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError } from "../utils/response.js";

const protect = asyncHandler(async (req, res, next) => {
  // Step 1 — check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "No token provided", 401);
  }

  // Step 2 — extract token
  const token = authHeader.split(" ")[1];

  // Step 3 — check blacklist
  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    return sendError(res, "Token is no longer valid", 401);
  }

  // Step 4 — verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // attach user to request
  next();
});

export default protect;