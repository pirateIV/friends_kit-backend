const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  timestamp: { type: Date, default: Date.now },
  //   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
