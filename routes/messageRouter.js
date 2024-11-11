const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

// GET request to retrieve paginated messages for a user

router.get("/", async (req, res) => {
  const messages = await Message.find({});
  res.status(200).json(messages);
});

router.get("/:id", async (req, res) => {
  const message = await Message.findById(req.params.id);
  res.status(200).json(message);
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { message },
      { new: true, runValidators: true },
    );
    if (!updatedMessage) {
      res.status(404).json({ err: "Message not found!" });
    }

    return res.status(200).json(updatedMessage);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      res.status(404).json({ err: "Message not found!" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 15 } = req.query; // Pagination params

  try {
    // Find messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ sender: id }, { receiver: id }],
    })
      .sort({ timestamp: -1 }) // Sort by latest first
      .skip((page - 1) * limit) // Skip messages for pagination
      .limit(parseInt(limit)); // Limit the number of messages per page

    const totalMessages = await Message.countDocuments({
      $or: [{ sender: id }, { receiver: id }],
    });

    res.json({
      messages,
      totalMessages,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
