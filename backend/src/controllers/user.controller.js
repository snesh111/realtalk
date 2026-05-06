import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { activeQuery } from "../utils/activeQuery.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return sendError(res, "User not found", 404);
  const [posts, totalComments] = await Promise.all([
    Post.find(activeQuery({ userId: user._id })).sort({ createdAt: -1 }).limit(10),
    Comment.countDocuments(activeQuery({ userId: user._id })),
  ]);
  return sendSuccess(res, {
    _id: user._id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    posts,
    totalPosts: posts.length,
    totalComments,
  }, "Profile fetched successfully");
});
