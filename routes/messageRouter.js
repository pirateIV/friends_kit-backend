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
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query; // Pagination params

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
