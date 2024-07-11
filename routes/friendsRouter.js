const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const authMiddleware = require("../middleware/authMiddleware");

// // Send friend request
// router.post("/:friendId", authMiddleware, userController.sendFriendRequest);

// // Accept a friend request
// router.post(
//   "/:friendId/accept",
//   authMiddleware,
//   userController.acceptFriendRequest,
// );

// router.put(
//   "/friend-request/:userId/:friendId",
//   userController.updateFriendRequestStatus,
// );

router.put(
  "/friend-request/:friendId",
  authMiddleware,
  userController.sendFriendRequest,
);

module.exports = router;
