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

// Store the Socket.io instance in the app object
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Welcome message to the connected user
  socket.emit("message", "Welcome to chat");

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // Listen for chat messages
  socket.on("message", (msg) => {
    io.emit("message", msg);
    console.log(msg);
  });

  // Handle sending messages
  socket.on("send_message", async (message) => {
    try {
      const newMessage = new Message(message);
      await newMessage.save();
      io.emit("receive_message", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});
