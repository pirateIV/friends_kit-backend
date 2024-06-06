const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

// Get all messages
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({});
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
});

// Get messages sent by the authenticated user
router.get("/sent", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.id }).populate(
      "receiver",
      "username",
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get sent messages" });
  }
});

// Get messages received by the authenticated user
router.get("/received", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.id }).populate(
      "sender",
      "username",
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get received messages" });
  }
});

// Send a message
router.post("/:receiverId", authMiddleware, async (req, res) => {
  const io = req.app.get("io");
  const senderId = req.id;
  const receiverId = req.params.receiverId;
  const { content } = req.body;

  if (
    !mongoose.isValidObjectId(senderId) ||
    !mongoose.isValidObjectId(receiverId)
  ) {
    return res.sendStatus(400);
  }

  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    const savedMessage = await message.save();

    // Populate sender and receiver details if needed
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "username") // assuming 'username' is a field in User model
      .populate("receiver", "username"); // adjust fields as necessary

    // Emit a socket event
    io.emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
