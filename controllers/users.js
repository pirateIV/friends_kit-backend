const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Post = require("../models/Post");

exports.checkId = (req, res, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  console.log(`request id is ${userId}`);
  next();
};

exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    console.log(user, email);
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
  }
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

exports.getSpecificUser = async (req, res) => {
  const user = await User.findById(req.id)
    .select("-posts")
    .populate({ path: "friends" });

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

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("friends");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.getUserBySearchQuery = async (req, res) => {
  const query = req.query.q;
  try {
    const regex = new RegExp(query, "i");
    if (!query) {
      const users = await User.find({}).limit(5);
      return res.status(200).json(users);
    }
    const results = await User.find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { bio: { $regex: regex } },
      ],
    })
      .select("firstName lastName")
      .limit(5);
    res.json(results);
  } catch (error) {
    res.status(500).send(error);
  }
};

// exports.sendFriendRequest = async (req, res) => {
//   const userId = req.id;
//   const friendId = req.params.friendId;

//   if (!mongoose.Types.ObjectId.isValid(friendId)) {
//     return res.status(400).json({ error: "Invalid friend id" });
//   }
//   try {
//     const [user, friend] = await Promise.all([
//       await User.findById(userId),
//       await User.findById(friendId),
//     ]);

//     if (!user || !friend) {
//       return res.status(400).json({ error: "User or friend not found!" });
//     }

//     if (user.friends.includes(friendId)) {
//       return res.status(400).json({ error: "Already friends" });
//     }

//     user.friends.push(friendId);
//     await user.save();

//     res.status(200).json({
//       msg: "Friend request sent",
//       sender_id: userId,
//       sender_name: user.name,
//       recipient_id: friendId,
//       recipient_name: friend.name,
//     });
//   } catch (error) {
//     res.status(500).json({ err: error.message });
//   }
// };

// exports.acceptFriendRequest = async (req, res) => {
//   const userId = req.id;
//   const friendId = req.params.friendId;

//   if (!mongoose.Types.ObjectId.isValid(friendId)) {
//     return res.status(400).json({ error: "Invalid friend id" });
//   }

//   try {
//     const [user, friend] = await Promise.all([
//       await User.findById(userId),
//       await User.findById(friendId),
//     ]);

//     if (!user || !friend) {
//       return res.status(400).json({ error: "User or friend not found" });
//     }
//     console.log(user.friends, friend.friends);
//     if (user.friends.includes(friendId)) {
//       return res.status(400).json({ msg: "Already friends" });
//     }
//     if (!friend.friends.includes(userId)) {
//       return res.status(400).json({ error: "Friend request not found" });
//     }

//     user.friends.push(friendId);
//     await user.save();

//     res.status(200).json({ message: "Friend request accepted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateFriendRequestStatus = async (req, res) => {
  const { userId, friendId } = req.params;
  const { action } = req.body;

  // try {
  //   if (!["accept", "reject"].includes(action)) {
  //     return res.status(400).send("Invalid Action");
  //   }

  //   if (action === "accept") {
  //     await User.findOneAndUpdate(
  //       {
  //         _id: userId,
  //         "friendRequests.friendId": friendId,
  //       },
  //       { $set: { "friendRequests.status": 3 } },
  //       { new: true },
  //     );
  //   } else if (action === "reject") {
  //     await User.findOneAndUpdate(
  //       { _id: userId },
  //       { $pull: { friendRequests: { friendId: friendId } } },
  //       { new: true },
  //     );
  //   }
  // } catch (error) {
  //   res.status(500).send("Internal Server Error", error);
  // }

  try {
  } catch (error) {}
};

exports.sendFriendRequest = async (req, res) => {
  const userId = req.id;
  const { friendId } = req.params;

  try {
    const requestedFriend = await User.findById(friendId);

    // check if user exists
    if (!requestedFriend) {
      return res.status(400).json("User not found");
    }

    // check if friendRequest is present
    const isRequested = requestedFriend.friendRequests.find(
      (friend) => friend.id === userId,
    );

    if (isRequested) {
      return res.status(400).json("Friend Request already sent");
    }

    // check if status is "4"

    requestedFriend = requestedFriend.friendRequests.push({
      friendId,
      status: 1,
    });
    await requestedFriend.save();
  } catch (error) {
    res.status(404).json(error);
  }
};
