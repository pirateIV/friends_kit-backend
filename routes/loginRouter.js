require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/User');

router.post('/api/users', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }
  const userForToken = { email: user.email, id: user._id };

  const token = jwt.sign(userForToken, process.env.TOKEN_SECRET);
  res.status(200).send({ token, name: `${user.firstName} ${user.lastName}` });
});

module.exports = router;
