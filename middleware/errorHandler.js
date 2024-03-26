const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id!' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error collection')
  ) {
    const user = err.message.email;
    return res
      .status(400)
      .json({ error: `expected username to be unique`, msg: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ err: 'token missing or invalid' });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired!',
    });
  }

  next(err);
};

module.exports = errorHandler;
