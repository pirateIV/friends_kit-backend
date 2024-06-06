const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const connectDb = require("./config/db");
const usersRouter = require("./routes/usersRouter");
const loginRouter = require("./routes/loginRouter");
const authRouter = require("./routes/authRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentRouter");
const friendsRouter = require("./routes/friendsRouter");
const messageRouter = require("./routes/messageRouter");

mongoose.set("strictQuery", false);
connectDb();

app.get("/", (req, res) => {
  res.send("Express app init...");
});

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/protected", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/messages", messageRouter);

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
