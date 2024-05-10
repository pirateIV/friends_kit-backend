// errorHandler middleware function to handle different types of errors
const errorHandler = (err, req, res, next) => {
  // Handle CastError: MongoDB cast error (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id!' });
  }
  // Handle ValidationError: MongoDB validation error
  else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  // Handle duplicate key error
  else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error collection')
  ) {
    // Extract the user from the error message
    const user = err.message.email; 
    return res
      .status(400)
      .json({ error: `expected username to be unique`, msg: err.message });
  }
  // Handle JsonWebTokenError: JWT error for missing or invalid token
  else if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ err: 'token missing or invalid' });
  }
  // Handle TokenExpiredError: JWT error for expired token
  else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired!',
    });
  }

  // Pass the error to the next middleware if not handled above
  next(err);
};

// Export the errorHandler middleware function
module.exports = errorHandler;
