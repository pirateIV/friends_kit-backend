require("dotenv").config();
const { Server } = require("socket.io");

const app = require("./app");

const port = 5000;

const expressServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = new Server(expressServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Upon connection - only to user
  socket.emit("message", "Welcome to chat");

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // Listen for chat messages
  socket.on("message", (msg) => {
    io.emit("message", msg);
    console.log(msg);
  });
});
