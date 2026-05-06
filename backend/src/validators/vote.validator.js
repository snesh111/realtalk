export const validateVote = (req, res, next) => {
  const { targetId, targetType, type } = req.body;
  const errors = [];

  if (!targetId) errors.push("targetId is required");
  if (!["post", "comment"].includes(targetType))
    errors.push("targetType must be 'post' or 'comment'");
  if (!["upvote", "downvote"].includes(type))
    errors.push("type must be 'upvote' or 'downvote'");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, data: null, message: errors[0] });
  }
  next();
};
