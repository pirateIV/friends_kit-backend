require("dotenv").config();
const mongoose = require("mongoose");

const DB_PASSWORD = process.env.DB_PASSWORD;

// const DB = process.env.MONGO_URI.replace('<password>', DB_PASSWORD);
const DB = process.env.MONGO_URI;

const connectDb = async () => {
  // await mongoose.createConnection(DB).asPromise();
  await mongoose.connect(DB);
};

module.exports = connectDb;
