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
  socket.on("private message", ({ message, fromSelf, to }) => {
    // socket.emit("private message", { from: socket.userID, fromSelf });
    socket.to(to).to(socket.userID).emit("private message", {
      from: socket.userID,
      fromSelf,
      message,
    });
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
