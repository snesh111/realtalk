const VALID_CATEGORIES = ["Career", "Tech", "College", "Life", "Finance"];

export const validateCreatePost = (req, res, next) => {
  const { title, content, category } = req.body;
  const errors = [];

  if (!title || title.trim().length < 10)
    errors.push("Title must be at least 10 characters");
  if (title && title.trim().length > 150)
    errors.push("Title cannot exceed 150 characters");
  if (!content || content.trim().length < 20)
    errors.push("Content must be at least 20 characters");
  if (!category || !VALID_CATEGORIES.includes(category))
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, data: null, message: errors[0] });
  }
  next();
};

export const validateUpdatePost = (req, res, next) => {
  const { title, content } = req.body;

  if (title && title.trim().length < 10) {
    return res.status(400).json({ success: false, data: null, message: "Title must be at least 10 characters" });
  }
  if (content && content.trim().length < 20) {
    return res.status(400).json({ success: false, data: null, message: "Content must be at least 20 characters" });
  }
  next();
};
