require("dotenv").config();
const { Server } = require("socket.io");
const app = require("./app");
const Message = require("./models/Message");
const User = require("./models/User");
const port = 5000;

const crypto = require("crypto");

// Start the Express server
const expressServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.io
const io = new Server(expressServer, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

const getRandomId = () => {
  return crypto.randomBytes(20).toString("hex");
};

io.use((socket, next) => {
  const { userID, username } = socket.handshake.auth;
  // const sessionID =

  if (!userID) {
    return next(new Error("Invalid userID"));
  }

  socket.userID = userID;
  socket.sessionID = userID;
  socket.username = username;

  next();
});

io.on("connection", async (socket) => {
  console.log(`User ${socket.username} connected`);

  // join the "userID" room
  socket.join(socket.userID);

  socket.on("join_room", (roomID) => {
    socket.join(roomID);

    console.log(`User joined room ${roomID}`);
  });

  await User.findByIdAndUpdate(socket.userID, {
    online: true,
  });

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    online: true,
  });

  socket.emit("connection message", {
    message: "Welcome to chat app",
    from: socket.userID,
  });

  socket.on("private message", async ({ sender, receiver, message }) => {
    try {
      const newMessage = await Message({
        sender,
        receiver,
        message,
      });

      io.to(sender).emit("private message", newMessage);
      io.to(receiver).emit("private message", newMessage);

      await newMessage.save();
    } catch (error) {
      console.log(error);
    }
  });

  const userMessages = await Message.find({
    $or: [{ sender: socket.userID }, { receiver: socket.userID }],
  });

  io.to(socket.userID).emit("previousMessages", userMessages);

  // Handle disconnection
  socket.on("disconnect", async () => {
    socket.broadcast.emit("user disconnected", {
      userID: socket.userID,
      username: socket.username,
      online: false,
    });

    await User.findByIdAndUpdate(socket.userID, {
      online: false,
    });
    console.log(`User ${socket.username} disconnected`);
  });
});
