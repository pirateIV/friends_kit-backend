require("dotenv").config();
const { Server } = require("socket.io");
const app = require("./app");
const Message = require("./models/Message");
const User = require("./models/User");
const port = 5000;

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

io.use((socket, next) => {
  const { userID, username } = socket.handshake.auth;

  if (!userID) {
    return next(new Error("Invalid userID"));
  }

  socket.userID = userID;
  socket.username = username;

  next();
});

io.on("connection", async (socket) => {
  console.log(`User ${socket.username} connected`);

  // join the "userID" room
  socket.join(socket.userID);

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

  // Handle incoming messages
  socket.on("private message", async ({ message, receiverId }) => {
    const privateMessage = { from: socket.userID, message };

    const newMessage = new Message({
      message,
      sender: socket.userID,
      receiver: receiverId,
      status: "sent",
    });

    try {
      await newMessage.save();

      io.to(receiverId).emit("private message", {
        ...newMessage._doc,
        fromSelf: false,
      });
      io.to(socket.userID).emit("private message", {
        ...newMessage._doc,
        fromSelf: true,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

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
