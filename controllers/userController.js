const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
    console.log(error.message);
  }

  const user = new User({});
};
const updateUser = () => {};
const deleteUser = () => {};

const getSpecificUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  return res.status(200).json(user)

  // try {
  //   if (!user) {
  //     return res.status(400).json({ error: 'user not found!' });
  //   }
  //   return res.status(200).json(user);
  // } catch (error) {
  //   // res.status(400).json(error);
  //   console.log(error.stack)
  // }
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser, getSpecificUser };
