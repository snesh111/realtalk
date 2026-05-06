import mongoose from "mongoose";
import Vote from "../models/vote.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { activeQuery } from "../utils/activeQuery.js";

export const castVote = asyncHandler(async (req, res) => {
  const { targetId, targetType, type } = req.body;
  if (!["upvote", "downvote"].includes(type)) {
    return sendError(res, "Invalid vote type", 400);
  }
  if (!["post", "comment"].includes(targetType)) {
    return sendError(res, "Invalid target type", 400);
  }
  const Model = targetType === "post" ? Post : Comment;
  const target = await Model.findOne(activeQuery({ _id: targetId }));
  if (!target) return sendError(res, `${targetType} not found`, 404);
  if (target.userId.toString() === req.user._id.toString()) {
    return sendError(res, "You cannot vote on your own content", 403);
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingVote = await Vote.findOne({
      userId: req.user._id, targetId, targetType,
    }).session(session);
    let changeValue = 0;
    let action = "";
    if (existingVote) {
      if (existingVote.type === type) {
        await Vote.deleteOne({ _id: existingVote._id }, { session });
        changeValue = type === "upvote" ? -1 : 1;
        action = "removed";
      } else {
        await Vote.updateOne({ _id: existingVote._id }, { $set: { type } }, { session });
        changeValue = type === "upvote" ? 2 : -2;
        action = "switched";
      }
    } else {
      await Vote.create([{ userId: req.user._id, targetId, targetType, type }], { session });
      changeValue = type === "upvote" ? 1 : -1;
      action = "voted";
    }
    await Model.updateOne({ _id: targetId }, { $inc: { voteCount: changeValue } }, { session });
    await session.commitTransaction();
    const updated = await Model.findById(targetId);
    return sendSuccess(res, {
      action,
      type: action === "removed" ? null : type,
      newVoteCount: updated.voteCount,
    }, action === "removed" ? "Vote removed" : action === "switched" ? "Vote switched" : "Vote recorded");
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});
