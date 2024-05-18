const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Post = require("../models/Post");

exports.checkId = (req, res, next, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  console.log(`request id is ${userId}`);
  next();
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-posts");
  res.status(200).json(users);
};

exports.createNewUser = async (req, res) => {
  const body = req.body;
  const password = body.password;

  if (password.length < 8) {
    return res.status(400).json({ msg: "minimum password should be 8" });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      ...body,
      passwordHash,
      avatar: body.avatar && req.file.path,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.id;
  console.log(userId);

  await User.findByIdAndUpdate(
    userId,
    { ...req.body, avatar: req.body.avatar && req.file.path },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(400).json({ error: "user not found!" });
      }
      res.status(201).json(updatedUser);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(400).json({ error: "user not found!" });
  }
  return res.status(204).end();
};

exports.getSpecificUser = async (req, res, next) => {
  const user = await User.findById(req.id).select("-posts");

  try {
    if (!user) {
      return res.status(400).json({ error: "user not found!" });
    }
    return res.status(200).json({ name: user.name, user });
  } catch (error) {
    // next(error);
    return res.status(400).json(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.sendFriendRequest = async (req, res, next) => {
  const userId = req.id;
  const friendId = req.params.friendId;

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(400).json({ error: "Invalid friend id" });
  }
  try {
    const [user, friend] = await Promise.all([
      await User.findById(userId),
      await User.findById(friendId),
    ]);

    if (!user || !friend) {
      return res.status(400).json({ error: "User or friend not found!" });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: "Already friends" });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ msg: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const userId = req.id;
  const friendId = req.params.friendId;

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(400).json({ error: "Invalid friend id" });
  }

  try {
    const [user, friend] = await Promise.all([
      await User.findById(userId),
      await User.findById(friendId),
    ]);

    if (!user || !friend) {
      return res.status(400).json({ error: "User or friend not found" });
    }
    console.log(user.friends, friend.friends);
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ msg: "Already friends" });
    }
    if (!friend.friends.includes(userId)) {
      return res.status(400).json({ error: "Friend request not found" });
    }

    friend.friends.push(userId);
    await friend.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getSpecificUser = async (req, res, next) => {
//   const { id } = req.params;
//   const user = await User.findById(id);

//   try {
//     if (!user) {
//       return res.status(200).json({ error: 'user not found!' });
//     }
//     return res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };
