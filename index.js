require("dotenv").config();
const { Server } = require("socket.io");
const app = require("./app");
const Message = require("./models/Message");
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
});

io.use((socket, next) => {
  const { userID } = socket.handshake.auth;

  if (!userID) {
    return next(new Error("Invalid userID"));
  }

  socket.userID = userID;

  next();
});

io.on("connection", (socket) => {
  console.log(`User ${socket.userID} connected`);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.userID} disconnected`);
  });
});
