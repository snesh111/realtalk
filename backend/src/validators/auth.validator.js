export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3)
    errors.push("Username must be at least 3 characters");
  if (username && username.trim().length > 20)
    errors.push("Username cannot exceed 20 characters");
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))
    errors.push("Valid email is required");
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, data: null, message: errors[0] });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, data: null, message: errors[0] });
  }
  next();
};
