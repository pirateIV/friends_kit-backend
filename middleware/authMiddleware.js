require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer")
  ) {
    // extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
    // token = req.headers('authorization').replace('Bearer ', '');
  }

  // return if token is not provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // verify JWT
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ err, message: err.message });
    }
    req.id = decodedToken.id;
    next();
  });
};

module.exports = authMiddleware;
