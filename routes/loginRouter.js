require('dotenv').config();

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenSecret = process.env.TOKEN_SECRET;

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = { email: user.email, id: user._id };

    const token = jwt.sign(userForToken, tokenSecret);
    res.status(200).json({ token, name });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
