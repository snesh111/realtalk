const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Duplicate entry — already exists"
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Invalid token"
    });
  }

  // Default
  return res.status(500).json({
    success: false,
    data: null,
    message: err.message || "Internal server error"
  });
};

export default errorHandler;