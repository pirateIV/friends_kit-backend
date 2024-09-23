const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageID: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: [String],
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

messageSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
    ret.id = doc._id;
    return ret;
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
