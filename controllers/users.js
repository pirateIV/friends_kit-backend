const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const checkId = (req, res, next, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  console.log(`User id is ${userId}`);
  next();
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const createNewUser = async (req, res) => {
  const body = req.body;
  const password = body.password;

  if (password.length < 8) {
    return res.status(400).json({ msg: 'minimum password should be 8' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({ ...body, passwordHash });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  console.log(req.file);
  console.log(req.body);
  res.json({ body: req.body });
  return;
  // const user = await User.findByIdAndUpdate(userId)
};

const deleteUser = () => {};

const getSpecificUser = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  const { id } = req.params;
  const user = await User.findById(id);

  try {
    if (!user) {
      return res.status(200).json({ error: 'user not found!' });
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkId,
  updateUser,
  deleteUser,
  getAllUsers,
  createNewUser,
  getSpecificUser,
};
