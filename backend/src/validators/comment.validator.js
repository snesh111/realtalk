export const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim().length < 2) {
    return res.status(400).json({ success: false, data: null, message: "Comment must be at least 2 characters" });
  }
  if (content.trim().length > 500) {
    return res.status(400).json({ success: false, data: null, message: "Comment cannot exceed 500 characters" });
  }
  next();
};
