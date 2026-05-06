import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { activeQuery } from "../utils/activeQuery.js";

export const getComments = asyncHandler(async (req, res) => {
  const { sort = "top" } = req.query;
  const post = await Post.findOne(activeQuery({ _id: req.params.postId }));
  if (!post) return sendError(res, "Post not found", 404);
  const sortQuery = sort === "top" ? { voteCount: -1 } : { createdAt: -1 };
  const comments = await Comment.find(
    activeQuery({ postId: req.params.postId })
  ).sort(sortQuery);
  const result = comments.map(c => ({
    ...c.toObject(),
    isSolution: post.solutionCommentId
      ? c._id.toString() === post.solutionCommentId.toString()
      : false,
  }));
  return sendSuccess(res, { comments: result }, "Comments fetched successfully");
});

export const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) return sendError(res, "Content is required", 400);
  const post = await Post.findOne(activeQuery({ _id: req.params.postId }));
  if (!post) return sendError(res, "Post not found", 404);

  // Fetch user from DB to get username
  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "User not found", 404);

  const comment = await Comment.create({
    postId: req.params.postId,
    userId: user._id,
    authorName: user.username,
    content,
  });
  await Post.updateOne({ _id: req.params.postId }, { $inc: { commentCount: 1 } });
  return sendSuccess(res, comment, "Comment added successfully", 201);
});

export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) return sendError(res, "Content is required", 400);
  const comment = await Comment.findOne(activeQuery({ _id: req.params.commentId }));
  if (!comment) return sendError(res, "Comment not found", 404);
  if (comment.userId.toString() !== req.user._id.toString()) {
    return sendError(res, "Not authorized to update this comment", 403);
  }
  comment.content = content;
  comment.isEdited = true;
  await comment.save();
  return sendSuccess(res, comment, "Comment updated successfully");
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne(activeQuery({ _id: req.params.commentId }));
  if (!comment) return sendError(res, "Comment not found", 404);
  if (
    comment.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return sendError(res, "Not authorized to delete this comment", 403);
  }
  comment.isDeleted = true;
  comment.deletedAt = new Date();
  await comment.save();
  await Post.updateOne({ _id: comment.postId }, { $inc: { commentCount: -1 } });
  return sendSuccess(res, null, "Comment deleted successfully");
});
