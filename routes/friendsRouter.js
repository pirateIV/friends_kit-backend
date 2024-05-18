const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const authMiddleware = require("../middleware/authMiddleware");

// Send friend request
router.post("/:friendId", authMiddleware, userController.sendFriendRequest);

// Accept a friend request
router.post(
  "/:friendId/accept",
  authMiddleware,
  userController.acceptFriendRequest,
);

module.exports = router;
