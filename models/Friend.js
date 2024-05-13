const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
